use serde::Serialize;

#[derive(Serialize)]
pub struct LoginResponse {
    pub access_token: String,
}