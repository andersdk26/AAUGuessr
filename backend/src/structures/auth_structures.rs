use serde::Serialize;
use serde::Deserialize;

#[derive(Serialize)]
pub struct LoginResponse {
    pub access_token: String,
}

#[derive(Serialize, Deserialize)]
    pub struct JwtClaims {
    pub sub: String,
    pub exp: usize,
    pub iat: usize,
}

pub struct AuthenticatedUser {
    pub user_id: String,
}