use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use uuid::Uuid;
use crate::{
    error::AppError,
    models::database::{CreateDatabaseDto, DatabaseEntity, UpdateDatabaseDto},
    state::AppState,
};

pub async fn get_all(
    State(state): State<AppState>,
) -> Result<Json<Vec<DatabaseEntity>>, AppError> {
    let dbs = sqlx::query_as::<_, DatabaseEntity>("SELECT * FROM databases ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await?;

    Ok(Json(dbs))
}

pub async fn get_one(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<DatabaseEntity>, AppError> {
    let db = sqlx::query_as::<_, DatabaseEntity>("SELECT * FROM databases WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Không tìm thấy cơ sở dữ liệu #{}", id)))?;

    Ok(Json(db))
}

pub async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateDatabaseDto>,
) -> Result<(StatusCode, Json<DatabaseEntity>), AppError> {
    let new_id = Uuid::new_v4();
    let now = Utc::now();
    let status = payload.status.unwrap_or_else(|| "stopped".to_string());

    let db = sqlx::query_as::<_, DatabaseEntity>(
        r#"
        INSERT INTO databases (
            id, name, db_type, server, port, status, size, version, last_backup, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
        "#,
    )
    .bind(new_id)
    .bind(&payload.name)
    .bind(&payload.db_type)
    .bind(&payload.server)
    .bind(payload.port)
    .bind(&status)
    .bind(&payload.size)
    .bind(&payload.version)
    .bind(&payload.last_backup)
    .bind(now)
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(db)))
}

pub async fn update(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateDatabaseDto>,
) -> Result<Json<DatabaseEntity>, AppError> {
    let existing = sqlx::query_as::<_, DatabaseEntity>("SELECT * FROM databases WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Không tìm thấy cơ sở dữ liệu #{}", id)))?;

    let name = payload.name.unwrap_or(existing.name);
    let db_type = payload.db_type.unwrap_or(existing.db_type);
    let server = payload.server.or(existing.server);
    let port = payload.port.or(existing.port);
    let status = payload.status.unwrap_or(existing.status);
    let size = payload.size.or(existing.size);
    let version = payload.version.or(existing.version);
    let last_backup = payload.last_backup.or(existing.last_backup);

    let updated = sqlx::query_as::<_, DatabaseEntity>(
        r#"
        UPDATE databases SET
            name = $1, db_type = $2, server = $3, port = $4, status = $5,
            size = $6, version = $7, last_backup = $8
        WHERE id = $9
        RETURNING *
        "#,
    )
    .bind(&name)
    .bind(&db_type)
    .bind(&server)
    .bind(port)
    .bind(&status)
    .bind(&size)
    .bind(&version)
    .bind(&last_backup)
    .bind(id)
    .fetch_one(&state.db)
    .await?;

    Ok(Json(updated))
}

pub async fn remove(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let result = sqlx::query("DELETE FROM databases WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Không tìm thấy cơ sở dữ liệu #{}", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
