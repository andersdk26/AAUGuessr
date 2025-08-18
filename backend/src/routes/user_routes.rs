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
use sqlx::Row;
use regex::Regex;
use crate::server_error_handling::log_error;
use rocket::http::{Cookie, CookieJar, SameSite};

// Hashing
use argon2::{Argon2, PasswordHasher, PasswordHash, Params, Algorithm, Version};
use password_hash::{SaltString, rand_core::OsRng, PasswordVerifier};

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
async fn login_user(mut db: Connection<AagDb>, jar: &CookieJar<'_>, user: Json<UsersTableLoginInput>) -> Result<Json<LoginResponse>, Status> {
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
                                let refresh_token = generate_refresh_token(user_id).await;

                                set_refresh_cookie(jar, refresh_token);

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
async fn create_user(mut db: Connection<AagDb>, jar: &CookieJar<'_>, user: Json<UsersTableSignupInput>) -> Result<Json<LoginResponse>, Status> {
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
                let refresh_token = generate_refresh_token(user_id).await;

                set_refresh_cookie(jar, refresh_token);

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
async fn logout_user(mut db: Connection<AagDb>, jar: &CookieJar<'_>) -> Result<Status, Status> {
    // Clear the refresh token cookie
    jar.remove(Cookie::from("refreshToken"));

    // Check if the cookie was successfully removed
    if jar.get("refreshToken").is_none() {
        return Ok(Status::Ok);
    } else {
        log_error(db, 0, "Failed to clear refresh token cookie").await;
        return Err(Status::InternalServerError);
        
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
    // ToDo: Implement token generation logic
    return user_id.to_string();
}

async fn generate_refresh_token(user_id: i64) -> String {
    // ToDo: Implement token generation logic
    return user_id.to_string();
}

fn set_refresh_cookie(jar: &CookieJar<'_>, refresh_token: String) {
    let cookie = Cookie::build(("refreshToken", refresh_token))
        .http_only(true)
        .secure(true) // requires HTTPS
        .same_site(SameSite::Lax)
        .path("/")
        .max_age(Duration::days(7))
        .build();

    jar.add(cookie);
}

pub fn get_routes() -> Vec<Route> {
    routes![read_user, set_username, login_user, create_user, logout_user]
}
