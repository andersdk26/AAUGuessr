use rocket::request::{FromRequest, Outcome};
use rocket::{Request};
use jsonwebtoken::{decode, DecodingKey, Validation};
use rocket::http::Status;

// Structures
use crate::structures::auth_structures::AuthenticatedUser;
use crate::structures::auth_structures::JwtClaims;


#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthenticatedUser {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // Find the Authorization header
        let auth_header = match req.headers().get_one("Authorization") {
            Some(h) => h,
            None => return Outcome::Error((Status::Unauthorized, ())),
        };

        // Check if the header starts with "Bearer "
        let token = match auth_header.strip_prefix("Bearer ") {
            Some(t) => t,
            None => return Outcome::Error((Status::Unauthorized, ())),
        };

        // Decode the JWT token
        let jwt_secret = rocket::Config::figment().extract_inner::<String>("jwt_secret").unwrap();

        match decode::<JwtClaims>(
            token,
            &DecodingKey::from_secret(jwt_secret.as_ref()),
            &Validation::default()
        ) {
            // If decoding is successful, extract the user ID
            Ok(data) => Outcome::Success(AuthenticatedUser {
                user_id: data.claims.sub,
            }),
            Err(_) => Outcome::Error((Status::Unauthorized, ())),
        }
    }
}