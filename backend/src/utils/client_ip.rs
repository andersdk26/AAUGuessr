use rocket::{request::{FromRequest, Outcome}, Request};
use rocket::http::Status;

pub struct ClientIp(pub std::net::IpAddr);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for ClientIp {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        match req.client_ip() {
            Some(ip) => Outcome::Success(ClientIp(ip)),
            None => Outcome::Forward(Status::BadRequest),
        }
    }
}