use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use serde::Deserialize;
use uuid::Uuid;
use crate::{
    error::AppError,
    models::log::{CreateLogDto, LogEntity},
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct LogsQuery {
    pub limit: Option<i64>,
}

pub async fn get_all(
    State(state): State<AppState>,
    Query(query): Query<LogsQuery>,
) -> Result<Json<Vec<LogEntity>>, AppError> {
    let limit = query.limit.unwrap_or(50).clamp(1, 200);

    let logs = sqlx::query_as::<_, LogEntity>(
        "SELECT * FROM logs ORDER BY created_at DESC LIMIT $1"
    )
    .bind(limit)
    .fetch_all(&state.db)
    .await?;

    Ok(Json(logs))
}

pub async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateLogDto>,
) -> Result<(StatusCode, Json<LogEntity>), AppError> {
    let new_id = Uuid::new_v4();
    let level = payload.level.unwrap_or_else(|| "INFO".to_string());
    let now = Utc::now();

    let log = sqlx::query_as::<_, LogEntity>(
        r#"
        INSERT INTO logs (id, level, service, message, meta, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        "#,
    )
    .bind(new_id)
    .bind(&level)
    .bind(&payload.service)
    .bind(&payload.message)
    .bind(&payload.meta)
    .bind(now)
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(log)))
}

pub async fn clear(
    State(state): State<AppState>,
) -> Result<StatusCode, AppError> {
    sqlx::query("DELETE FROM logs").execute(&state.db).await?;
    Ok(StatusCode::NO_CONTENT)
}
