#[derive(serde::Serialize, serde::Deserialize)]
pub struct UsersTable {
    pub id: i64,
    pub username: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct UsersTableLoginInput {
    pub email: String,
    pub password: String,
    // pub stay_signed_in: bool,
}