use axum::{extract::State, Json};
use std::collections::HashMap;
use crate::{
    error::AppError,
    models::{
        dashboard::{
            DashboardDatabasesSummary, DashboardProjectsSummary, DashboardStatsResponse,
            DashboardUsersSummary,
        },
        database::DatabaseEntity,
        log::LogEntity,
        project::Project,
        server::{Server, ServerSummary},
        user::User,
    },
    state::AppState,
};

pub async fn get_stats(
    State(state): State<AppState>,
) -> Result<Json<DashboardStatsResponse>, AppError> {
    let servers = sqlx::query_as::<_, Server>("SELECT * FROM servers")
        .fetch_all(&state.db)
        .await?;

    let projects = sqlx::query_as::<_, Project>("SELECT * FROM projects")
        .fetch_all(&state.db)
        .await?;

    let databases = sqlx::query_as::<_, DatabaseEntity>("SELECT * FROM databases")
        .fetch_all(&state.db)
        .await?;

    let users = sqlx::query_as::<_, User>("SELECT * FROM users")
        .fetch_all(&state.db)
        .await?;

    let recent_logs = sqlx::query_as::<_, LogEntity>(
        "SELECT * FROM logs ORDER BY created_at DESC LIMIT 5"
    )
    .fetch_all(&state.db)
    .await?;

    // Servers summary
    let s_total = servers.len();
    let s_online = servers.iter().filter(|s| s.status == "online").count();
    let s_offline = servers.iter().filter(|s| s.status == "offline").count();
    let s_warning = servers.iter().filter(|s| s.status == "warning").count();

    // Projects summary
    let p_total = projects.len();
    let p_running = projects.iter().filter(|p| p.status == "running").count();
    let p_stopped = projects.iter().filter(|p| p.status == "stopped").count();
    let mut p_summary = HashMap::new();
    for p in &projects {
        *p_summary.entry(p.project_type.clone()).or_insert(0) += 1;
    }

    // Databases summary
    let d_total = databases.len();
    let d_online = databases.iter().filter(|d| d.status == "online").count();
    let mut d_summary = HashMap::new();
    for d in &databases {
        *d_summary.entry(d.db_type.clone()).or_insert(0) += 1;
    }

    // Users summary
    let u_total = users.len();
    let u_active = users.iter().filter(|u| u.is_active).count();

    Ok(Json(DashboardStatsResponse {
        servers: ServerSummary {
            total: s_total,
            online: s_online,
            offline: s_offline,
            warning: s_warning,
        },
        projects: DashboardProjectsSummary {
            total: p_total,
            running: p_running,
            stopped: p_stopped,
            summary: p_summary,
        },
        databases: DashboardDatabasesSummary {
            total: d_total,
            online: d_online,
            summary: d_summary,
        },
        users: DashboardUsersSummary {
            total: u_total,
            active: u_active,
        },
        recent_logs,
    }))
}
