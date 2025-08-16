use rand::Rng;
use crate::db::connection::AagDb;
use crate::models::user_schema::UsersTable;
use crate::models::user_schema::UsersTableLoginInput;
use crate::models::user_schema::UsersTableSignupInput;
use crate::structures::default::DefaultResponse;
use rocket::serde::json::Json;
use rocket::{get, routes, Route};
use rocket_db_pools::{sqlx, Connection};
use sqlx::Row;
use regex::Regex;

// Hashing
use argon2::{Argon2, PasswordHasher, PasswordHash, Params, Algorithm, Version};
use password_hash::{SaltString, rand_core::OsRng, PasswordVerifier};

#[get("/user/<id>")]
async fn read_user(mut db: Connection<AagDb>, id: i64) -> Option<Json<UsersTable>> {
    let row = sqlx::query("SELECT username FROM \"user\".\"Users\" WHERE id = $1")
        .bind(id)
        .fetch_one(&mut **db)
        .await;

    match row {
        Ok(r) => {
            let username: String = r.try_get("username").unwrap_or_default();
            Some(Json(UsersTable { id, username, email: String::new(), password: String::new() }))
        }
        Err(e) => {
            let username = format!("Failed to fetch log with ID {}: {}", id, e);
            Some(Json(UsersTable { id, username, email: String::new(), password: String::new() }))
        }
    }
}

#[get("/user/username/<id>?<set>")]
async fn set_username(
    mut db: Connection<AagDb>,
    id: i64,
    set: &str,
) -> Option<Json<DefaultResponse>> {
    let result = sqlx::query("UPDATE \"user\".\"Users\" SET username = $1 WHERE id = $2")
        .bind(set)
        .bind(id)
        .execute(&mut **db)
        .await;

    match result {
        Ok(_) => Some(Json(DefaultResponse {
            message: "Username set successfully".to_string(),
            status: "success".to_string(),
        })),
        Err(e) => {
            let message = format!("Failed to fetch log with ID {}: {}", id, e);
            Some(Json(DefaultResponse {
                message: message,
                status: "failed".to_string(),
            }))
        }
    }
}

#[post("/user/login", format = "json", data = "<user>")]
async fn login_user(mut db: Connection<AagDb>, user: Json<UsersTableLoginInput>) -> Option<Json<DefaultResponse>> {
    let invalid_value_response = Some(Json(DefaultResponse {
        message: "Incorrect email or password".to_string(),
        status: "failed".to_string(),
    }));

    // Validate email and password
    if !{verify_email(&user.email)} {
        return invalid_value_response;
    }
    if !{verify_password_strength(&user.password)} {
        return invalid_value_response;
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
                if verify_password(&user.password, &hashed_password.trim_end()) {
                    Some(Json(DefaultResponse {
                        message: "Logged in successfully".to_string(),
                        status: "success".to_string(),
                    }))
                } else {
                    invalid_value_response
                }
            }
            Err(e) => {
                let message = format!("Failed to retrieve password: {}", e);
                Some(Json(DefaultResponse {
                    message,
                    status: "failed".to_string(),
                }))
            }
        }
    }
    Err(e) => {
        let message = format!("Failed to fetch login {}: {}", &user.email, e);
        Some(Json(DefaultResponse {
            message,
            status: "failed".to_string(),
        }))
    }
}
}

#[post("/user/create", data = "<user>")]
async fn create_user(mut db: Connection<AagDb>, user: Json<UsersTableSignupInput>) -> Option<Json<DefaultResponse>> {
    let invalid_value_response = Some(Json(DefaultResponse {
        message: "Incorrect email or password".to_string(),
        status: "failed".to_string(),
    }));

    // Validate username, email and password
    if !{verify_username(&user.username)} {
        return invalid_value_response;
    }
    if !{verify_email(&user.email)} {
        return invalid_value_response;
    }
    if !{verify_password_strength(&user.password)} {
        return invalid_value_response;
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
                return Some(Json(DefaultResponse {
                    message: "User already exists".to_string(),
                    status: "failed".to_string(),
                }));
            }
        }
        Err(e) => {
            let message = format!("Failed to check if user exists: {}", e);
            return Some(Json(DefaultResponse {
                message,
                status: "failed".to_string(),
            }));
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
                let token = generate_token(user_id).await;

                return Some(Json(DefaultResponse {
                    message: format!("\"token\": \"{}\"", token),
                    status: "success".to_string(),
                }));
            }
            Err(e) => {
                let message = format!("Failed to create user: {}", e);
                return Some(Json(DefaultResponse {
                    message,
                    status: "failed".to_string(),
                }));
            }
        }
    }

    return Some(Json(DefaultResponse {
        message: "Failed to create user".to_string(),
        status: "failed".to_string(),
    }))
    
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

async fn generate_token(user_id: i64) -> String {
    // ToDd: Implement token generation logic
    return user_id.to_string();
}

pub fn get_routes() -> Vec<Route> {
    routes![read_user, set_username, login_user, create_user]
}
