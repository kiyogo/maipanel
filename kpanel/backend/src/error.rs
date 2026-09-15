use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
#[allow(dead_code)]
pub enum AppError {
    #[error("Không tìm thấy tài nguyên: {0}")]
    NotFound(String),

    #[error("Dữ liệu không hợp lệ: {0}")]
    BadRequest(String),

    #[error("Chưa xác thực hoặc token không hợp lệ: {0}")]
    Unauthorized(String),

    #[error("Bạn không có quyền thực hiện hành động này: {0}")]
    Forbidden(String),

    #[error("Lỗi cơ sở dữ liệu: {0}")]
    DatabaseError(#[from] sqlx::Error),

    #[error("Lỗi xác thực mật khẩu")]
    BcryptError(#[from] bcrypt::BcryptError),

    #[error("Lỗi tạo hoặc giải mã JWT")]
    JwtError(#[from] jsonwebtoken::errors::Error),

    #[error("Lỗi nội bộ hệ thống: {0}")]
    Internal(#[from] anyhow::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match &self {
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg.clone()),
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg.clone()),
            AppError::Unauthorized(msg) => (StatusCode::UNAUTHORIZED, msg.clone()),
            AppError::Forbidden(msg) => (StatusCode::FORBIDDEN, msg.clone()),
            AppError::DatabaseError(e) => {
                tracing::error!("Database error: {:?}", e);
                (StatusCode::INTERNAL_SERVER_ERROR, "Lỗi kết nối cơ sở dữ liệu".to_string())
            }
            AppError::BcryptError(e) => {
                tracing::error!("Bcrypt error: {:?}", e);
                (StatusCode::INTERNAL_SERVER_ERROR, "Lỗi mã hóa mật khẩu".to_string())
            }
            AppError::JwtError(e) => {
                (StatusCode::UNAUTHORIZED, format!("Token không hợp lệ hoặc đã hết hạn: {}", e))
            }
            AppError::Internal(e) => {
                tracing::error!("Internal error: {:?}", e);
                (StatusCode::INTERNAL_SERVER_ERROR, "Lỗi máy chủ nội bộ".to_string())
            }
        };

        let body = Json(json!({
            "statusCode": status.as_u16(),
            "message": error_message,
            "error": status.canonical_reason().unwrap_or("Error")
        }));

        (status, body).into_response()
    }
}
