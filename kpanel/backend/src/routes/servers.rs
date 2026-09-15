use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use uuid::Uuid;
use crate::{
    error::AppError,
    models::server::{CreateServerDto, Server, ServerSummary, UpdateServerDto},
    state::AppState,
};

pub async fn get_all(
    State(state): State<AppState>,
) -> Result<Json<Vec<Server>>, AppError> {
    let servers = sqlx::query_as::<_, Server>("SELECT * FROM servers ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await?;

    Ok(Json(servers))
}

pub async fn get_summary(
    State(state): State<AppState>,
) -> Result<Json<ServerSummary>, AppError> {
    let servers = sqlx::query_as::<_, Server>("SELECT * FROM servers")
        .fetch_all(&state.db)
        .await?;

    let total = servers.len();
    let online = servers.iter().filter(|s| s.status == "online").count();
    let offline = servers.iter().filter(|s| s.status == "offline").count();
    let warning = servers.iter().filter(|s| s.status == "warning").count();

    Ok(Json(ServerSummary {
        total,
        online,
        offline,
        warning,
    }))
}

pub async fn get_one(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Server>, AppError> {
    let server = sqlx::query_as::<_, Server>("SELECT * FROM servers WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Không tìm thấy server #{}", id)))?;

    Ok(Json(server))
}

pub async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateServerDto>,
) -> Result<(StatusCode, Json<Server>), AppError> {
    let new_id = Uuid::new_v4();
    let now = Utc::now();
    let status = payload.status.unwrap_or_else(|| "offline".to_string());

    let server = sqlx::query_as::<_, Server>(
        r#"
        INSERT INTO servers (
            id, name, ip, region, os, status, cpu, ram, disk,
            ssh_port, notes, gpu, temperature, uptime, network_traffic, load_average,
            created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
        "#,
    )
    .bind(new_id)
    .bind(&payload.name)
    .bind(&payload.ip)
    .bind(&payload.region)
    .bind(&payload.os)
    .bind(&status)
    .bind(payload.cpu.unwrap_or(0))
    .bind(payload.ram.unwrap_or(0))
    .bind(payload.disk.unwrap_or(0))
    .bind(payload.ssh_port)
    .bind(&payload.notes)
    .bind(payload.gpu.unwrap_or(0))
    .bind(&payload.temperature)
    .bind(&payload.uptime)
    .bind(&payload.network_traffic)
    .bind(&payload.load_average)
    .bind(now)
    .bind(now)
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(server)))
}

pub async fn update(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateServerDto>,
) -> Result<Json<Server>, AppError> {
    let existing = sqlx::query_as::<_, Server>("SELECT * FROM servers WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Không tìm thấy server #{}", id)))?;

    let name = payload.name.unwrap_or(existing.name);
    let ip = payload.ip.unwrap_or(existing.ip);
    let region = payload.region.or(existing.region);
    let os = payload.os.or(existing.os);
    let status = payload.status.unwrap_or(existing.status);
    let cpu = payload.cpu.unwrap_or(existing.cpu);
    let ram = payload.ram.unwrap_or(existing.ram);
    let disk = payload.disk.unwrap_or(existing.disk);
    let ssh_port = payload.ssh_port.or(existing.ssh_port);
    let notes = payload.notes.or(existing.notes);
    let gpu = payload.gpu.unwrap_or(existing.gpu);
    let temperature = payload.temperature.or(existing.temperature);
    let uptime = payload.uptime.or(existing.uptime);
    let network_traffic = payload.network_traffic.or(existing.network_traffic);
    let load_average = payload.load_average.or(existing.load_average);
    let updated_at = Utc::now();

    let updated = sqlx::query_as::<_, Server>(
        r#"
        UPDATE servers SET
            name = $1, ip = $2, region = $3, os = $4, status = $5,
            cpu = $6, ram = $7, disk = $8, ssh_port = $9, notes = $10,
            gpu = $11, temperature = $12, uptime = $13, network_traffic = $14,
            load_average = $15, updated_at = $16
        WHERE id = $17
        RETURNING *
        "#,
    )
    .bind(&name)
    .bind(&ip)
    .bind(&region)
    .bind(&os)
    .bind(&status)
    .bind(cpu)
    .bind(ram)
    .bind(disk)
    .bind(ssh_port)
    .bind(&notes)
    .bind(gpu)
    .bind(&temperature)
    .bind(&uptime)
    .bind(&network_traffic)
    .bind(&load_average)
    .bind(updated_at)
    .bind(id)
    .fetch_one(&state.db)
    .await?;

    Ok(Json(updated))
}

pub async fn remove(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let result = sqlx::query("DELETE FROM servers WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Không tìm thấy server #{}", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
