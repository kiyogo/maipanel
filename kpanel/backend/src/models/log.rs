use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct LogEntity {
    pub id: Uuid,
    pub level: String,
    pub service: String,
    pub message: String,
    pub meta: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateLogDto {
    pub level: Option<String>,
    pub service: String,
    pub message: String,
    pub meta: Option<serde_json::Value>,
}
