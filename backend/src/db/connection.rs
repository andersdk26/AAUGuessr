use rocket::fairing::AdHoc;
use rocket_db_pools::{sqlx, Database};

#[derive(Database)]
#[database("aag_db")]
pub struct AagDb(sqlx::PgPool);

pub fn init_db() -> rocket::fairing::AdHoc {
    AdHoc::on_ignite("Database", |rocket| async { rocket.attach(AagDb::init()) })
}
