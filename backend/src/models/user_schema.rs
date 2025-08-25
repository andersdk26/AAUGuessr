use serde::Serialize;
use serde::Deserialize;

// #[derive(Serialize, Deserialize)]
// pub struct UsersTable {
//     pub id: i64,
//     pub username: String,
//     pub email: String,
//     pub password: String,
// }

// Version of UsersTable without sensitive information
#[derive(Serialize, Deserialize)]
pub struct UsersTableNonsens {
    pub id: i64,
    pub username: String,
}