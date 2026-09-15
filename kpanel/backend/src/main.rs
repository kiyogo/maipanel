mod config;
mod error;
mod middleware;
mod models;
mod routes;
mod services;
mod state;

use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::{
    config::AppConfig,
    routes::create_router,
    services::seed::seed_database,
    state::AppState,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Khởi tạo logger / tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "kpanel_backend=debug,tower_http=debug,axum=trace".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // 2. Nạp cấu hình từ môi trường
    let config = AppConfig::from_env();
    tracing::info!("Starting Kpanel Rust Backend on port {}...", config.port);
    tracing::info!("Connecting to PostgreSQL at {}...", config.database_url);

    // 3. Khởi tạo kết nối PostgreSQL (PgPool)
    let pool = match sqlx::postgres::PgPoolOptions::new()
        .max_connections(20)
        .acquire_timeout(std::time::Duration::from_secs(10))
        .connect(&config.database_url)
        .await
    {
        Ok(p) => {
            tracing::info!("PostgreSQL connection established successfully.");
            
            // Chạy migrations nếu kết nối thành công
            if let Err(e) = sqlx::migrate!("./migrations").run(&p).await {
                tracing::warn!("Lưu ý khi chạy migrations: {:?}", e);
            } else {
                tracing::info!("Database migrations executed successfully.");
            }

            // Seed dữ liệu mẫu nếu bảng trống
            if let Err(e) = seed_database(&p).await {
                tracing::warn!("Lưu ý khi seed database: {:?}", e);
            }

            p
        }
        Err(e) => {
            tracing::error!("Không thể kết nối ngay tới PostgreSQL: {:?}", e);
            tracing::warn!("Hệ thống sẽ thử lại kết nối khi PostgreSQL container sẵn sàng.");
            // Cung cấp lazy pool cho trường hợp docker compose khởi động
            sqlx::postgres::PgPoolOptions::new()
                .max_connections(20)
                .connect_lazy(&config.database_url)?
        }
    };

    // 4. Khởi tạo AppState
    let app_state = AppState::new(pool, config.clone());

    // 5. Cấu hình CORS cho phép Frontend React gọi API
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // 6. Khởi tạo router với state và CORS
    let app = create_router()
        .layer(cors)
        .with_state(app_state);

    // 7. Lắng nghe trên 0.0.0.0:PORT
    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    tracing::info!("🚀 Kpanel Rust Backend đang chạy tại http://localhost:{}/api/v1", config.port);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
