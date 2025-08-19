use rocket_db_pools::{sqlx, Connection};
use crate::db::connection::AagDb;

struct ErrorLog {
    user_id: i64,
    error_message: String,
}

pub async fn log_error(mut db: Connection<AagDb> ,user_id: i64, error_message: &str) {
    // Create an instance of ErrorLog with the provided user_id and error_message
    let error_log = ErrorLog {
        user_id,
        error_message: error_message.to_string(),
    };

    // Insert the error log into the database
    let result;
    if error_log.user_id == 0 {
            result = sqlx::query(
            "INSERT INTO \"log\".\"UserErrors\" (error_message) VALUES ($1)")
            .bind(error_log.error_message)
            .execute(&mut **db)
            .await;
    } else {
        result = sqlx::query(
            "INSERT INTO \"log\".\"UserErrors\" (user_id, error_message) VALUES ($1, $2)")
            .bind(error_log.user_id)
            .bind(error_log.error_message)
            .execute(&mut **db)
            .await;
    }

    // Handle the result of the insert operation
    match result {
        Ok(_) => {
            println!("Error logged successfully for user ID {}", user_id);
        }
        Err(e) => {
            eprintln!("Failed to log error for user ID {}: {}", user_id, e);
        }
    }
}