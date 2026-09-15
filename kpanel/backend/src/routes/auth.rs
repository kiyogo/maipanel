use axum::{
    extract::State,
    Json,
};
use chrono::Utc;
use jsonwebtoken::{encode, EncodingKey, Header};
use crate::{
    error::AppError,
    middleware::auth::{AuthUser, Claims},
    models::user::{LoginDto, LoginResponse, User, UserDto},
    state::AppState,
};

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginDto>,
) -> Result<Json<LoginResponse>, AppError> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::Unauthorized("Tài khoản không hợp lệ hoặc không tồn tại".to_string()))?;

    if !user.is_active {
        return Err(AppError::Unauthorized("Tài khoản đã bị khóa".to_string()));
    }

    let is_valid = bcrypt::verify(&payload.password, &user.password)?;
    if !is_valid {
        return Err(AppError::Unauthorized("Mật khẩu không chính xác".to_string()));
    }

    // Cập nhật last_login_at
    let now = Utc::now();
    sqlx::query("UPDATE users SET last_login_at = $1 WHERE id = $2")
        .bind(now)
        .bind(user.id)
        .execute(&state.db)
        .await?;

    let expiration = Utc::now().timestamp() + state.config.jwt_expiration_secs;
    let claims = Claims {
        sub: user.id,
        email: user.email.clone(),
        role: user.role.clone(),
        exp: expiration as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_bytes()),
    )?;

    Ok(Json(LoginResponse {
        access_token: token,
        user: UserDto {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    }))
}

pub async fn get_profile(
    auth_user: AuthUser,
    State(state): State<AppState>,
) -> Result<Json<UserDto>, AppError> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(auth_user.id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound("Không tìm thấy thông tin người dùng".to_string()))?;

    Ok(Json(UserDto {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    }))
}
