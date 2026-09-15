use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_expiration_secs: i64,
    pub port: u16,
}

impl AppConfig {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();

        // Xây dựng database url từ DATABASE_URL hoặc các biến DB_* của Docker
        let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| {
            let host = env::var("DB_HOST").unwrap_or_else(|_| "localhost".to_string());
            let port = env::var("DB_PORT").unwrap_or_else(|_| "5432".to_string());
            let user = env::var("DB_USERNAME").unwrap_or_else(|_| "kpanel".to_string());
            let pass = env::var("DB_PASSWORD").unwrap_or_else(|_| "kpanel123".to_string());
            let name = env::var("DB_NAME").unwrap_or_else(|_| "kpanel".to_string());
            format!("postgres://{}:{}@{}:{}/{}", user, pass, host, port, name)
        });

        let jwt_secret = env::var("JWT_SECRET")
            .unwrap_or_else(|_| "kpanel-super-secret-jwt-key-2026".to_string());

        let jwt_expiration_secs = env::var("JWT_EXPIRATION_SECS")
            .ok()
            .and_then(|s| s.parse::<i64>().ok())
            .unwrap_or(7 * 24 * 60 * 60); // 7 ngày

        let port = env::var("PORT")
            .ok()
            .and_then(|p| p.parse::<u16>().ok())
            .unwrap_or(3001);

        Self {
            database_url,
            jwt_secret,
            jwt_expiration_secs,
            port,
        }
    }
}
