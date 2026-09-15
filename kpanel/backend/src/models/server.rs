use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Server {
    pub id: Uuid,
    pub name: String,
    pub ip: String,
    pub region: Option<String>,
    pub os: Option<String>,
    pub status: String,
    pub cpu: i32,
    pub ram: i32,
    pub disk: i32,
    pub ssh_port: Option<i32>,
    pub notes: Option<String>,
    pub gpu: i32,
    pub temperature: Option<String>,
    pub uptime: Option<String>,
    pub network_traffic: Option<String>,
    pub load_average: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateServerDto {
    pub name: String,
    pub ip: String,
    pub region: Option<String>,
    pub os: Option<String>,
    pub status: Option<String>,
    pub cpu: Option<i32>,
    pub ram: Option<i32>,
    pub disk: Option<i32>,
    pub ssh_port: Option<i32>,
    pub notes: Option<String>,
    pub gpu: Option<i32>,
    pub temperature: Option<String>,
    pub uptime: Option<String>,
    pub network_traffic: Option<String>,
    pub load_average: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateServerDto {
    pub name: Option<String>,
    pub ip: Option<String>,
    pub region: Option<String>,
    pub os: Option<String>,
    pub status: Option<String>,
    pub cpu: Option<i32>,
    pub ram: Option<i32>,
    pub disk: Option<i32>,
    pub ssh_port: Option<i32>,
    pub notes: Option<String>,
    pub gpu: Option<i32>,
    pub temperature: Option<String>,
    pub uptime: Option<String>,
    pub network_traffic: Option<String>,
    pub load_average: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ServerSummary {
    pub total: usize,
    pub online: usize,
    pub offline: usize,
    pub warning: usize,
}
