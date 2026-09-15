use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use uuid::Uuid;
use crate::{
    error::AppError,
    models::user::{CreateUserDto, UpdateUserDto, User, UserDto},
    state::AppState,
};

pub async fn get_all(
    State(state): State<AppState>,
) -> Result<Json<Vec<User>>, AppError> {
    let users = sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await?;

    Ok(Json(users))
}

pub async fn get_one(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<UserDto>, AppError> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Không tìm thấy tài khoản #{}", id)))?;

    Ok(Json(UserDto {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    }))
}

pub async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateUserDto>,
) -> Result<(StatusCode, Json<UserDto>), AppError> {
    let exists: Option<(Uuid,)> = sqlx::query_as("SELECT id FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&state.db)
        .await?;

    if exists.is_some() {
        return Err(AppError::BadRequest("Email đã được sử dụng".to_string()));
    }

    let new_id = Uuid::new_v4();
    let now = Utc::now();
    let hashed_pw = bcrypt::hash(&payload.password, 10)?;
    let role = payload.role.unwrap_or_else(|| "Viewer".to_string());

    let user = sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users (id, email, name, password, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, TRUE, $6, $7)
        RETURNING *
        "#,
    )
    .bind(new_id)
    .bind(&payload.email)
    .bind(&payload.name)
    .bind(&hashed_pw)
    .bind(&role)
    .bind(now)
    .bind(now)
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(UserDto {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    })))
}

pub async fn update(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateUserDto>,
) -> Result<Json<UserDto>, AppError> {
    let existing = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Không tìm thấy người dùng #{}", id)))?;

    let email = payload.email.unwrap_or(existing.email);
    let name = payload.name.unwrap_or(existing.name);
    let role = payload.role.unwrap_or(existing.role);
    let is_active = payload.is_active.unwrap_or(existing.is_active);
    let updated_at = Utc::now();

    let password = if let Some(p) = payload.password {
        bcrypt::hash(&p, 10)?
    } else {
        existing.password
    };

    let user = sqlx::query_as::<_, User>(
        r#"
        UPDATE users SET
            email = $1, name = $2, password = $3, role = $4, is_active = $5, updated_at = $6
        WHERE id = $7
        RETURNING *
        "#,
    )
    .bind(&email)
    .bind(&name)
    .bind(&password)
    .bind(&role)
    .bind(is_active)
    .bind(updated_at)
    .bind(id)
    .fetch_one(&state.db)
    .await?;

    Ok(Json(UserDto {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    }))
}

pub async fn remove(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let result = sqlx::query("DELETE FROM users WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Không tìm thấy tài khoản #{}", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
