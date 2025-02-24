#[macro_use]
extern crate rocket;
use crate::db::connection::AagDb;
use crate::structures::default::DefaultResponse;
use rocket::serde::json::Json;
use rocket_cors::{AllowedOrigins, Cors, CorsOptions};
use rocket_db_pools::Connection;

mod db;
mod models;
mod routes;
mod structures;

use db::connection::init_db;
use rocket::fairing::AdHoc;

// Default route
#[get("/")]
async fn index(_db: Connection<AagDb>) -> &'static str {
    "Successfully connected to PostgreSQL database 'AAUGuessr'!"
}

// Return a JSON response with the name provided in the URL, route
#[get("/<name>")]
fn hello(name: &str) -> Json<DefaultResponse> {
    Json(DefaultResponse {
        message: name.to_string(),
        status: "success".to_string(),
    })
}

// CORS configuration
fn create_cors() -> Cors {
    CorsOptions {
        allowed_origins: AllowedOrigins::all(), // Allow all origins (can be restricted to a list of allowed origins)
        allowed_methods: vec!["Get".parse().unwrap(), "Post".parse().unwrap()]
            .into_iter()
            .collect(),
        allowed_headers: rocket_cors::AllowedHeaders::all(),
        ..Default::default()
    }
    .to_cors()
    .expect("CORS configuration failed")
}

// Rocket configuration
#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(create_cors())
        .attach(init_db())
        .mount("/", routes![index])
        .mount("/hello", routes![hello])
        .mount("/", routes::user_routes::get_routes())
        .attach(AdHoc::on_liftoff("Liftoff Message", |_| {
            Box::pin(async {
                println!("Rocket has launched!");
            })
        }))
}
