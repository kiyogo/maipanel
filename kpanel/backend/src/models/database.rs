use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DatabaseEntity {
    pub id: Uuid,
    pub name: String,
    #[serde(rename = "type")]
    pub db_type: String,
    pub server: Option<String>,
    pub port: Option<i32>,
    pub status: String,
    pub size: Option<String>,
    pub version: Option<String>,
    #[serde(rename = "lastBackup")]
    pub last_backup: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDatabaseDto {
    pub name: String,
    #[serde(rename = "type", default = "default_db_type")]
    pub db_type: String,
    pub server: Option<String>,
    pub port: Option<i32>,
    pub status: Option<String>,
    pub size: Option<String>,
    pub version: Option<String>,
    #[serde(rename = "lastBackup")]
    pub last_backup: Option<String>,
}

fn default_db_type() -> String {
    "PostgreSQL".to_string()
}

#[derive(Debug, Deserialize)]
pub struct UpdateDatabaseDto {
    pub name: Option<String>,
    #[serde(rename = "type")]
    pub db_type: Option<String>,
    pub server: Option<String>,
    pub port: Option<i32>,
    pub status: Option<String>,
    pub size: Option<String>,
    pub version: Option<String>,
    #[serde(rename = "lastBackup")]
    pub last_backup: Option<String>,
}

#[derive(Debug, Serialize)]
#[allow(dead_code)]
pub struct DatabaseSummary {
    pub total: usize,
    pub online: usize,
    pub summary: HashMap<String, usize>,
}
