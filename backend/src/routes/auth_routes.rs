use rand::Rng;
use rocket::http::Status;
use rocket::time::Duration;
use rocket::serde::json::Json;
use rocket::{routes, Route};
use rocket_db_pools::{sqlx, Connection};
use chrono::Utc;
use chrono::NaiveDateTime;
use sqlx::Row;
use regex::Regex;
use rocket::http::{Cookie, CookieJar, SameSite};

// Hashing
use argon2::{Argon2, PasswordHasher, PasswordHash, Params, Algorithm, Version};
use password_hash::{SaltString, rand_core::OsRng, PasswordVerifier};
use sha2::{Sha256, Digest};
use jsonwebtoken::{encode, EncodingKey, Header};

// Structures
use crate::db::connection::AagDb;
use crate::models::auth_schema::UsersTableLoginInput;
use crate::models::auth_schema::UsersTableSignupInput;
use crate::structures::auth_structures::LoginResponse;
use crate::structures::auth_structures::JwtClaims;

// Utils
use crate::utils::server_error_handling::log_error;
use crate::utils::client_ip::ClientIp;

#[post("/user/login", format = "json", data = "<user>")]
async fn login_user(mut db: Connection<AagDb>, jar: &CookieJar<'_>, ip: ClientIp, user: Json<UsersTableLoginInput>) -> Result<Json<LoginResponse>, Status> {
    // Validate email and password
    if !{verify_email(&user.email)} {
        return Err(Status::Forbidden)
    }
    if !{verify_password_strength(&user.password)} {
        return Err(Status::Forbidden)
    }

    // Find user in database by email
    let result = sqlx::query("SELECT * FROM \"user\".\"Users\" WHERE email = $1")
        .bind(&user.email)
        .fetch_one(&mut **db)
        .await;

    match result {
        Ok(row) => {
            match row.try_get::<String, _>("password") {
                Ok(hashed_password) => {
                    // Verify password
                    if verify_password(&user.password, &hashed_password.trim_end()) {
                        match row.try_get::<i64, _>("id") {
                            Ok(user_id) => {
                                // Successfully logged in
                                let access_token = generate_access_token(user_id).await;

                                if !generate_refresh_token(db, jar, user_id, user.stay_signed_in, ip, "").await {
                                    return Err(Status::InternalServerError);
                                }                             

                                return Ok(Json(LoginResponse {
                                    access_token,
                                }));
                            }
                            Err(e) => {
                                log_error(db, 0, &format!("Failed to retrieve user ID: {}", e)).await;
                                return Err(Status::InternalServerError);
                            }
                            
                        }
                        
                    } else {
                        Err(Status::Forbidden)
                    }
                }
                Err(e) => {
                    log_error(db, 0, &format!("Failed to retrieve password: {}", e)).await;
                    Err(Status::InternalServerError)
                }
            }
        }
        Err(e) => {
            log_error(db, 0, &format!("Failed to fetch login {}: {}", &user.email, e)).await;
            Err(Status::InternalServerError)
        }
    }
}

#[post("/user/create", data = "<user>")]
async fn create_user(mut db: Connection<AagDb>, jar: &CookieJar<'_>, ip: ClientIp, user: Json<UsersTableSignupInput>) -> Result<Json<LoginResponse>, Status> {
    // Validate username, email and password
    if !{verify_username(&user.username)} {
        return Err(Status::Forbidden);
    }
    if !{verify_email(&user.email)} {
        return Err(Status::Forbidden);
    }
    if !{verify_password_strength(&user.password)} {
        return Err(Status::Forbidden);
    }

    // Check if user already exists by email or username
    let result = sqlx::query("SELECT COUNT(1) FROM \"user\".\"Users\" WHERE (email = $1 OR username = $2)")
        .bind(&user.email)
        .bind(&user.username)
        .fetch_one(&mut **db)
        .await;

    match result {
        Ok(row) => {
            let count: i64 = row.try_get(0).unwrap_or_default();
            if count > 0 {
                return Err(Status::Conflict); // User already exists
            }
        }
        Err(e) => {
            log_error(db, 0, &format!("Failed to check if user exists: {}", e)).await;
            return Err(Status::InternalServerError);
        }
    }

    let hashed_password = hash_password(&user.password);

    for _i in 0..10 {
        // Generate a unique user ID
        let user_id = rand::rng().random_range(1_000_000_000..10_000_000_000);

        // Check if the user ID already exists in the database
        let result2 = sqlx::query("INSERT INTO \"user\".\"Users\" (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id")
        .bind(&user_id)
        .bind(&user.username)
        .bind(&user.email)
        .bind(&hashed_password)
        .fetch_one(&mut **db)
        .await;

        match result2 {
            Ok(row) => {
                if row.is_empty() {
                    continue;
                }
                let access_token = generate_access_token(user_id).await;

                if !generate_refresh_token(db, jar, user_id, user.stay_signed_in, ip, "").await {
                    return Err(Status::InternalServerError);
                } 

                return Ok(Json(LoginResponse {
                    access_token,
                }));
            }
            Err(e) => {
                log_error(db, 0, &format!("Failed to create user: {}", e)).await;
                return Err(Status::InternalServerError);
            }
        }
    }

    log_error(db, 0, "Failed to create user: {}").await;
    return Err(Status::InternalServerError);
    
}

#[post("/user/logout")]
async fn logout_user(mut db: Connection<AagDb>, jar: &CookieJar<'_>, ip: ClientIp) -> Result<Status, Status> {
    // Check if the refresh token cookie exists
    let refresh_token = jar.get("refreshToken")
        .map(|cookie| cookie.value().to_string())
        .unwrap_or_default();

    if refresh_token.is_empty() {
        return Err(Status::BadRequest);
    }

    // Clear the refresh token cookie
    jar.remove(Cookie::from("refreshToken"));

    let time_now = Utc::now().naive_utc();

    // Clear the refresh token in the database
    let result = sqlx::query("UPDATE \"user\".\"RefreshTokens\" SET \"revokedAt\" = $1, \"revokedByIp\" = $2 WHERE token = $3;")
        .bind(time_now)
        .bind(ip.0.to_string()) // Set revokedByIp to empty string
        .bind(sha256_hash(&refresh_token)) // Use the SHA256 hash of the token
        .execute(&mut **db)
        .await;

    match result {
        Ok(row) => {
            if row.rows_affected() == 0 {
                log_error(db, 0, &format!("Refresh token not changed in database: {}", sha256_hash(&refresh_token))).await;
            }
        },
        Err(e) => {
            log_error(db, 0, &format!("Failed to clear refresh token: {}", e)).await;
            return Err(Status::InternalServerError);
        }
    }

    return Ok(Status::Ok);
}

#[post("/user/refreshtoken")]
async fn refresh_token(mut db: Connection<AagDb>, jar: &CookieJar<'_>, ip: ClientIp) -> Result<Json<LoginResponse>, Status> {
    // Check if the refresh token cookie exists
    let refresh_token = jar.get("refreshToken")
        .map(|cookie| cookie.value().to_string())
        .unwrap_or_default();

    if refresh_token.is_empty() {
        return Err(Status::BadRequest);
    }

    let hashed_token = sha256_hash(&refresh_token);

    // Find the refresh token in the database
    let result = sqlx::query("SELECT * FROM \"user\".\"RefreshTokens\" WHERE token = $1")
        .bind(&hashed_token)
        .fetch_one(&mut **db)
        .await;

    match result {
        Ok(row) => {
            let time_now = Utc::now().naive_utc();

            // Check if the token is expired
            let expires: NaiveDateTime = row.try_get("expires").unwrap_or(Utc::now().naive_utc());
            if Utc::now().naive_utc() > expires {
                return Err(Status::Unauthorized);
            }

            // Check if the token is revoked
            let revoked_at: Option<NaiveDateTime> = row.try_get("revokedAt").ok();
            if revoked_at.is_some() {
                return Err(Status::Unauthorized);
            }

            // Get the user ID associated with the token
            let user_id: i64 = row.try_get("userId").unwrap_or(0);
            if user_id == 0 {
                return Err(Status::Unauthorized);
            }

            // Fetch user details to check stay_signed_in preference
            let created_at: NaiveDateTime = row.try_get("createdAt").unwrap_or(time_now);
            if created_at == time_now {
                return Err(Status::InternalServerError);
            }
            let stay_signed_in = expires - created_at > chrono::Duration::days(1);

            // Generate new access token
            let access_token = generate_access_token(user_id).await;

            // Create a new refresh token and set it in the cookie and revoke the old one
            if !generate_refresh_token(db, jar, user_id, stay_signed_in, ip, &hashed_token).await {
                return Err(Status::InternalServerError);
            }

            // Return the new access token
            return Ok(Json(LoginResponse {
                access_token,
            }));
        }
        Err(e) => {
            log_error(db, 0, &format!("Failed to fetch refresh token: {}", e)).await;
            return Err(Status::InternalServerError);
        }
    }
}

fn hash_password(password: &str) -> String {
    // Generate salt
    let salt = SaltString::generate(&mut OsRng);

    // Set argon2 parameters
    let params = Params::new(32 * 1024, 3, 1, None).unwrap(); // 32KiB memory, 3 iterations, 1 parallelism
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);

    // Hash password
    let hashed_password = argon2
        .hash_password(password.as_bytes(), &salt)
        .unwrap()
        .to_string();
    hashed_password
}

fn verify_password(password: &str, hashed_password: &str) -> bool {
    // Parse hashed password
    let parsed_hash = PasswordHash::new(hashed_password).unwrap();
    
    // Set argon2 parameters
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, Params::default());
    
    // Verify password
    argon2.verify_password(password.as_bytes(), &parsed_hash).is_ok()
}

fn verify_username(username: &str) -> bool {
    let username_regex = Regex::new(r"^[a-zA-Z0-9_-]{4,20}$").unwrap();
    username_regex.is_match(username)
}

fn verify_email(email: &str) -> bool {
    let email_regex = Regex::new(r"^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$").unwrap();
    email_regex.is_match(email)
}

fn verify_password_strength(password: &str) -> bool {
    let has_letter = password.chars().any(|c| c.is_alphabetic());
    let has_digit = password.chars().any(|c| c.is_digit(10));
    let has_special = password.chars().any(|c| "!@#$%^&*()_+-=[]{}|;':,.<>?/".contains(c));
    let is_correct_length = (8..=32).contains(&password.len());

    has_letter && has_digit && has_special && is_correct_length
}

async fn generate_access_token(user_id: i64) -> String {
    let jwt_secret = rocket::Config::figment().extract_inner::<String>("jwt_secret").unwrap();

    // Generate JWT access token
    let header = Header::default();
    let body = JwtClaims {
        sub: user_id.to_string(),
        exp: (chrono::Utc::now() + chrono::Duration::minutes(15)).timestamp() as usize, // 15 minutes expiration
        iat: chrono::Utc::now().timestamp() as usize,
    };
    
    // Encode the token
    let secret = EncodingKey::from_secret(jwt_secret.as_bytes());
    let token = encode(&header, &body, &secret).unwrap();
    
    return token
}

async fn generate_refresh_token(mut db: Connection<AagDb>, jar: &CookieJar<'_>, user_id: i64, stay_signed_in: bool, ip: ClientIp, old_token_hash: &str) -> bool {
    let expire_time: NaiveDateTime;

    // Generate a new random refresh token
    let token = random_alphanumeric(32);

    // Set the refresh token in a secure cookie
    set_refresh_cookie(jar, token.clone(), stay_signed_in);

    if stay_signed_in {
        // Set expiration time to 30 days from now
        expire_time = Utc::now().naive_utc() + chrono::Duration::days(30);
    } else {
        // Set expiration time to 1 hour from now
        expire_time = Utc::now().naive_utc() + chrono::Duration::hours(1);
    }

    // Insert the new refresh token into the database
    let result = sqlx::query("INSERT INTO \"user\".\"RefreshTokens\" (\"userId\", token, expires, \"createdByIp\") VALUES ($1, $2, $3, $4)")
        .bind(user_id)
        .bind(sha256_hash(&token)) // Store the SHA256 hash of the token
        .bind(expire_time) // Set expiration to 30 days or 1 hour from now
        .bind(ip.0.to_string()) // Store the IP address that created the token
        .execute(&mut **db)
        .await;

    if let Err(e) = result {
        log_error(db, user_id, &format!("Failed to insert refresh token: {}", e)).await;
        return false;
    }

    if old_token_hash.is_empty() {
        return true; // No old token to revoke
    }
    
    // Revoke the old refresh token
    let result2 = sqlx::query("UPDATE \"user\".\"RefreshTokens\" SET \"revokedAt\" = $1, \"revokedByIp\" = $2  WHERE token = $3;")
        .bind(Utc::now().naive_utc()) // Set revokedAt to now without timezone
        .bind(ip.0.to_string()) // Set revokedByIp to the current IP address
        .bind(&old_token_hash) // Use the SHA256 hash of the token
        .execute(&mut **db)
        .await;

    match result2 {
        Ok(row) => {
            // Check if any row was affected
            if row.rows_affected() == 0 {
                log_error(db, user_id, &format!("Old refresh token not revoked in database: {}", &old_token_hash)).await;
                return false;
            }
        },
        Err(e) => {
            log_error(db, user_id, &format!("Failed to revoke old refresh token: {}", e)).await;
            return false;
        }
    }

    return true;
}

fn set_refresh_cookie(jar: &CookieJar<'_>, refresh_token: String, stay_signed_in: bool) {
    // Create a secure cookie for the refresh token
    let mut cookie = Cookie::build(("refreshToken", refresh_token))
        .http_only(false) // Set to true in production
        .secure(false) // requires HTTPS TODO: Enable this in production
        .same_site(SameSite::Lax)
        .path("/");
        
    // Set the max age based on whether the user wants to stay signed in
    if stay_signed_in {
        cookie = cookie.max_age(Duration::days(30));
    }

    // Build and add the cookie to the jar
    jar.add(cookie.build());
}

fn random_alphanumeric(len: usize) -> String {
    let charset = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ\
                    abcdefghijklmnopqrstuvwxyz\
                    0123456789";

    // Generate random string
    let mut rng = rand::rng();
    (0..len)
        .map(|_| {
            let idx = rng.random_range(0..charset.len());
            charset[idx] as char
        })
        .collect()
}

fn sha256_hash(token: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(token.as_bytes());
    let result = hasher.finalize();
    hex::encode(result) // Save in DB as hex string
}

pub fn get_routes() -> Vec<Route> {
    routes![login_user, create_user, logout_user, refresh_token]
}
