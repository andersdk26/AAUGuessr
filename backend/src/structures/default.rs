use serde::Serialize;

#[derive(Serialize)]
pub struct DefaultResponse {
    pub message: String,
    pub status: String,
}
