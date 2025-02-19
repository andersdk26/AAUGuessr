use crate::db::connection::AagDb;
use crate::models::user_schema::UsersTable;
use crate::structures::default::DefaultResponse;
use rocket::serde::json::Json;
use rocket::{get, routes, Route};
use rocket_db_pools::{sqlx, Connection};
use sqlx::Row;

#[get("/user/<id>")]
async fn read_user(mut db: Connection<AagDb>, id: i64) -> Option<Json<UsersTable>> {
    let row = sqlx::query("SELECT username FROM \"user\".\"Users\" WHERE id = $1")
        .bind(id)
        .fetch_one(&mut **db)
        .await;

    match row {
        Ok(r) => {
            let username: String = r.try_get("username").unwrap_or_default();
            Some(Json(UsersTable { id, username }))
        }
        Err(e) => {
            let username = format!("Failed to fetch log with ID {}: {}", id, e);
            Some(Json(UsersTable { id, username }))
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

pub fn get_routes() -> Vec<Route> {
    routes![read_user, set_username]
}
