use rocket::http::Status;
use rocket::serde::json::Json;
use rocket::{get, routes, Route};
use rocket_db_pools::{sqlx, Connection};
use sqlx::Row;

// Structures
use crate::db::connection::AagDb;
use crate::models::user_schema::UsersTableNonsens;

// Auth request guard
use crate::structures::auth_structures::AuthenticatedUser;

// Utils
use crate::utils::server_error_handling::log_error;

#[get("/user/getusername")]
async fn read_user(mut db: Connection<AagDb>, _user: AuthenticatedUser) -> Result<Json<UsersTableNonsens>, Status> {
    let row = sqlx::query("SELECT username FROM \"user\".\"Users\" WHERE id = $1")
        .bind(_user.user_id)
        .fetch_one(&mut **db)
        .await;

    match row {
        Ok(r) => {
            // Return non sensitive user information
            let username: String = r.try_get("username").unwrap_or_default();
            Ok(Json(UsersTableNonsens { id: _user.user_id, username }))
        }
        Err(sqlx::Error::RowNotFound) => {
            Err(Status::NotFound)
        }
        Err(e) => {
            log_error(db, _user.user_id, &format!("Failed to fetch user with ID {}: {}", _user.user_id, e)).await;
            Err(Status::InternalServerError)
        }
    }
}

#[get("/user/setusername?<set>")]
async fn set_username(
    mut db: Connection<AagDb>,
    _user: AuthenticatedUser,
    set: &str,
) -> Result<Status, Status> {
    let result = sqlx::query("UPDATE \"user\".\"Users\" SET username = $1 WHERE id = $2")
        .bind(set)
        .bind(_user.user_id)
        .execute(&mut **db)
        .await;

    match result {
        Ok(_) => Ok(Status::Ok),
        Err(e) => {
            log_error(db, _user.user_id, &format!("Failed to set username for user with ID {}: {}", _user.user_id, e)).await;
            Err(Status::InternalServerError)
        }
    }
}

pub fn get_routes() -> Vec<Route> {
    routes![read_user, set_username]
}
