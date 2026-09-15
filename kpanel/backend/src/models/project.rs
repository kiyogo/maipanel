use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Project {
    pub id: Uuid,
    pub name: String,
    #[serde(rename = "type")]
    pub project_type: String,
    pub server: Option<String>,
    pub domain: Option<String>,
    pub git: Option<String>,
    pub status: String,
    pub notes: Option<String>,
    #[serde(rename = "phpVersion")]
    pub php_version: Option<String>,
    #[serde(rename = "nodeVersion")]
    pub node_version: Option<String>,
    #[serde(rename = "pythonVersion")]
    pub python_version: Option<String>,
    pub framework: Option<String>,
    pub branch: Option<String>,
    pub ssl: Option<bool>,
    pub database: Option<String>,
    pub redis: Option<bool>,
    pub env: Option<String>,
    pub subdomain: Option<String>,
    #[serde(rename = "documentRoot")]
    pub document_root: Option<String>,
    pub composer: Option<bool>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateProjectDto {
    pub name: String,
    #[serde(rename = "type", default = "default_project_type")]
    pub project_type: String,
    pub server: Option<String>,
    pub domain: Option<String>,
    pub git: Option<String>,
    pub status: Option<String>,
    pub notes: Option<String>,
    #[serde(rename = "phpVersion")]
    pub php_version: Option<String>,
    #[serde(rename = "nodeVersion")]
    pub node_version: Option<String>,
    #[serde(rename = "pythonVersion")]
    pub python_version: Option<String>,
    pub framework: Option<String>,
    pub branch: Option<String>,
    pub ssl: Option<bool>,
    pub database: Option<String>,
    pub redis: Option<bool>,
    pub env: Option<String>,
    pub subdomain: Option<String>,
    #[serde(rename = "documentRoot")]
    pub document_root: Option<String>,
    pub composer: Option<bool>,
}

fn default_project_type() -> String {
    "web-nodejs".to_string()
}

#[derive(Debug, Deserialize)]
pub struct UpdateProjectDto {
    pub name: Option<String>,
    #[serde(rename = "type")]
    pub project_type: Option<String>,
    pub server: Option<String>,
    pub domain: Option<String>,
    pub git: Option<String>,
    pub status: Option<String>,
    pub notes: Option<String>,
    #[serde(rename = "phpVersion")]
    pub php_version: Option<String>,
    #[serde(rename = "nodeVersion")]
    pub node_version: Option<String>,
    #[serde(rename = "pythonVersion")]
    pub python_version: Option<String>,
    pub framework: Option<String>,
    pub branch: Option<String>,
    pub ssl: Option<bool>,
    pub database: Option<String>,
    pub redis: Option<bool>,
    pub env: Option<String>,
    pub subdomain: Option<String>,
    #[serde(rename = "documentRoot")]
    pub document_root: Option<String>,
    pub composer: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct ProjectSummary {
    pub total: usize,
    pub running: usize,
    pub stopped: usize,
    pub summary: HashMap<String, usize>,
}
