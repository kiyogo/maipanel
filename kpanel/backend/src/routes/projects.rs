use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use std::collections::HashMap;
use uuid::Uuid;
use crate::{
    error::AppError,
    models::project::{CreateProjectDto, Project, ProjectSummary, UpdateProjectDto},
    state::AppState,
};

pub async fn get_all(
    State(state): State<AppState>,
) -> Result<Json<Vec<Project>>, AppError> {
    let projects = sqlx::query_as::<_, Project>("SELECT * FROM projects ORDER BY created_at DESC")
        .fetch_all(&state.db)
        .await?;

    Ok(Json(projects))
}

pub async fn get_summary(
    State(state): State<AppState>,
) -> Result<Json<ProjectSummary>, AppError> {
    let projects = sqlx::query_as::<_, Project>("SELECT * FROM projects")
        .fetch_all(&state.db)
        .await?;

    let total = projects.len();
    let running = projects.iter().filter(|p| p.status == "running").count();
    let stopped = projects.iter().filter(|p| p.status == "stopped").count();

    let mut summary = HashMap::new();
    for p in &projects {
        *summary.entry(p.project_type.clone()).or_insert(0) += 1;
    }

    Ok(Json(ProjectSummary {
        total,
        running,
        stopped,
        summary,
    }))
}

pub async fn get_one(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Project>, AppError> {
    let project = sqlx::query_as::<_, Project>("SELECT * FROM projects WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Không tìm thấy dự án #{}", id)))?;

    Ok(Json(project))
}

pub async fn create(
    State(state): State<AppState>,
    Json(payload): Json<CreateProjectDto>,
) -> Result<(StatusCode, Json<Project>), AppError> {
    let new_id = Uuid::new_v4();
    let now = Utc::now();
    let status = payload.status.unwrap_or_else(|| "stopped".to_string());

    let project = sqlx::query_as::<_, Project>(
        r#"
        INSERT INTO projects (
            id, name, project_type, server, domain, git, status, notes,
            php_version, node_version, python_version, framework, branch,
            ssl, database, redis, env, subdomain, document_root, composer,
            created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING *
        "#,
    )
    .bind(new_id)
    .bind(&payload.name)
    .bind(&payload.project_type)
    .bind(&payload.server)
    .bind(&payload.domain)
    .bind(&payload.git)
    .bind(&status)
    .bind(&payload.notes)
    .bind(&payload.php_version)
    .bind(&payload.node_version)
    .bind(&payload.python_version)
    .bind(&payload.framework)
    .bind(&payload.branch)
    .bind(payload.ssl.unwrap_or(false))
    .bind(&payload.database)
    .bind(payload.redis.unwrap_or(false))
    .bind(&payload.env)
    .bind(&payload.subdomain)
    .bind(&payload.document_root)
    .bind(payload.composer.unwrap_or(false))
    .bind(now)
    .bind(now)
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(project)))
}

pub async fn update(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateProjectDto>,
) -> Result<Json<Project>, AppError> {
    let existing = sqlx::query_as::<_, Project>("SELECT * FROM projects WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Không tìm thấy dự án #{}", id)))?;

    let name = payload.name.unwrap_or(existing.name);
    let project_type = payload.project_type.unwrap_or(existing.project_type);
    let server = payload.server.or(existing.server);
    let domain = payload.domain.or(existing.domain);
    let git = payload.git.or(existing.git);
    let status = payload.status.unwrap_or(existing.status);
    let notes = payload.notes.or(existing.notes);
    let php_version = payload.php_version.or(existing.php_version);
    let node_version = payload.node_version.or(existing.node_version);
    let python_version = payload.python_version.or(existing.python_version);
    let framework = payload.framework.or(existing.framework);
    let branch = payload.branch.or(existing.branch);
    let ssl = payload.ssl.or(existing.ssl);
    let database = payload.database.or(existing.database);
    let redis = payload.redis.or(existing.redis);
    let env = payload.env.or(existing.env);
    let subdomain = payload.subdomain.or(existing.subdomain);
    let document_root = payload.document_root.or(existing.document_root);
    let composer = payload.composer.or(existing.composer);
    let updated_at = Utc::now();

    let updated = sqlx::query_as::<_, Project>(
        r#"
        UPDATE projects SET
            name = $1, project_type = $2, server = $3, domain = $4, git = $5,
            status = $6, notes = $7, php_version = $8, node_version = $9,
            python_version = $10, framework = $11, branch = $12, ssl = $13,
            database = $14, redis = $15, env = $16, subdomain = $17,
            document_root = $18, composer = $19, updated_at = $20
        WHERE id = $21
        RETURNING *
        "#,
    )
    .bind(&name)
    .bind(&project_type)
    .bind(&server)
    .bind(&domain)
    .bind(&git)
    .bind(&status)
    .bind(&notes)
    .bind(&php_version)
    .bind(&node_version)
    .bind(&python_version)
    .bind(&framework)
    .bind(&branch)
    .bind(ssl)
    .bind(&database)
    .bind(redis)
    .bind(&env)
    .bind(&subdomain)
    .bind(&document_root)
    .bind(composer)
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
    let result = sqlx::query("DELETE FROM projects WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Không tìm thấy dự án #{}", id)));
    }

    Ok(StatusCode::NO_CONTENT)
}
