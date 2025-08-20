use serde::Serialize;
use serde::Deserialize;

#[derive(Serialize, Deserialize)]
pub struct UsersTableLoginInput {
    pub email: String,
    pub password: String,
    pub stay_signed_in: bool,
}

#[derive(Serialize, Deserialize)]
pub struct UsersTableSignupInput {
    pub username: String,
    pub email: String,
    pub password: String,
    pub stay_signed_in: bool,
}