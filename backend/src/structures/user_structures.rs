use serde::Serialize;
use serde::Deserialize;

#[derive(Serialize)]
pub struct LoginResponse {
    pub access_token: String,
}

#[derive(Serialize, Deserialize)]
    pub struct JwtBody {
        pub user: String,
        pub exp: usize,
        pub created: usize,
    }