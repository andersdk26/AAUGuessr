use rand::Rng;
use rocket::http::Status;
use rocket::time::Duration;
use crate::db::connection::AagDb;
use crate::models::user_schema::UsersTableNonsens;
use crate::models::user_schema::UsersTableLoginInput;
use crate::models::user_schema::UsersTableSignupInput;
use crate::structures::user_structures::LoginResponse;
use rocket::serde::json::Json;
use rocket::{get, routes, Route};
use rocket_db_pools::{sqlx, Connection};
use chrono::Utc; // Import Utc from chrono
use sqlx::Row;
use regex::Regex;
use crate::utils::server_error_handling::log_error;
use crate::utils::client_ip::ClientIp;
use rocket::http::{Cookie, CookieJar, SameSite};

// Hashing
use argon2::{Argon2, PasswordHasher, PasswordHash, Params, Algorithm, Version};
use password_hash::{SaltString, rand_core::OsRng, PasswordVerifier};
use sha2::{Sha256, Digest};

#[get("/user/<id>")]
async fn read_user(mut db: Connection<AagDb>, id: i64) -> Result<Json<UsersTableNonsens>, Status> {
    let row = sqlx::query("SELECT username FROM \"user\".\"Users\" WHERE id = $1")
        .bind(id)
        .fetch_one(&mut **db)
        .await;

    match row {
        Ok(r) => {
            // Return non sensitive user information
            let username: String = r.try_get("username").unwrap_or_default();
            Ok(Json(UsersTableNonsens { id, username }))
        }
        Err(sqlx::Error::RowNotFound) => {
            Err(Status::NotFound)
        }
        Err(e) => {
            log_error(db, id, &format!("Failed to fetch user with ID {}: {}", id, e)).await;
            Err(Status::InternalServerError)
        }
    }
}

#[get("/user/username/<id>?<set>")]
async fn set_username(
    mut db: Connection<AagDb>,
    id: i64,
    set: &str,
) -> Result<Status, Status> {
    let result = sqlx::query("UPDATE \"user\".\"Users\" SET username = $1 WHERE id = $2")
        .bind(set)
        .bind(id)
        .execute(&mut **db)
        .await;

    match result {
        Ok(_) => Ok(Status::Ok),
        Err(e) => {
            log_error(db, id, &format!("Failed to set username for user with ID {}: {}", id, e)).await;
            Err(Status::InternalServerError)
        }
    }
}

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

                                if !generate_refresh_token(db, jar, user_id, user.stay_signed_in, ip).await {
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

                if !generate_refresh_token(db, jar, user_id, user.stay_signed_in, ip).await {
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

    // Clear the refresh token in the database
    let result = sqlx::query("UPDATE \"user\".\"RefreshTokens\" SET expires = $1, \"revokedAt\" = $1, \"revokedByIp\" = $2  WHERE token = '$3';")
        .bind(Utc::now()) // Set expiration to now
        .bind(ip.0.to_string()) // Set revokedByIp to empty string
        .bind(sha256_hash(&refresh_token)) // Use the SHA256 hash of the token
        .execute(&mut **db)
        .await
        .is_ok();

    if !result {
        log_error(db, 0, "Failed to clear refresh token in database").await;
        return Err(Status::InternalServerError);
    }

    return Ok(Status::Ok);
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
    // ToDo: Implement token generation logic
    return user_id.to_string();
}

async fn generate_refresh_token(mut db: Connection<AagDb>, jar: &CookieJar<'_>, user_id: i64, stay_signed_in: bool, ip: ClientIp) -> bool {
    let expire_time: chrono::DateTime<Utc>;
    let token = random_alphanumeric(32);

    set_refresh_cookie(jar, token.clone(), stay_signed_in);

    if stay_signed_in {
        // Set expiration time to 30 days from now
        expire_time = Utc::now() + chrono::Duration::days(30);
    } else {
        // Set expiration time to 1 hour from now
        expire_time = Utc::now() + chrono::Duration::hours(1);
    }

    let result = sqlx::query("INSERT INTO \"user\".\"RefreshTokens\" (\"userId\", token, expires, \"createdByIp\") VALUES ($1, $2, $3, $4)")
        .bind(user_id)
        .bind(sha256_hash(&token)) // Store the SHA256 hash of the token
        .bind(expire_time) // Set expiration to 30
        .bind(ip.0.to_string()) // Store the IP address that created the token
        .execute(&mut **db)
        .await;

    if let Err(e) = result {
        log_error(db, user_id, &format!("Failed to insert refresh token: {}", e)).await;
        return false;
    }

    return true;
}

fn set_refresh_cookie(jar: &CookieJar<'_>, refresh_token: String, stay_signed_in: bool) {
    // Create a secure cookie for the refresh token
    let mut cookie = Cookie::build(("refreshToken", refresh_token))
        // .http_only(true)
        // .secure(true) // requires HTTPS TODO: Enable this in production
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
    hex::encode(result) // Gem i DB som hex string
}

pub fn get_routes() -> Vec<Route> {
    routes![read_user, set_username, login_user, create_user, logout_user]
}
