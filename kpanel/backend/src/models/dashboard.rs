use serde::Serialize;
use std::collections::HashMap;
use crate::models::{log::LogEntity, server::ServerSummary};

#[derive(Debug, Serialize)]
pub struct DashboardUsersSummary {
    pub total: usize,
    pub active: usize,
}

#[derive(Debug, Serialize)]
pub struct DashboardProjectsSummary {
    pub total: usize,
    pub running: usize,
    pub stopped: usize,
    pub summary: HashMap<String, usize>,
}

#[derive(Debug, Serialize)]
pub struct DashboardDatabasesSummary {
    pub total: usize,
    pub online: usize,
    pub summary: HashMap<String, usize>,
}

#[derive(Debug, Serialize)]
pub struct DashboardStatsResponse {
    pub servers: ServerSummary,
    pub projects: DashboardProjectsSummary,
    pub databases: DashboardDatabasesSummary,
    pub users: DashboardUsersSummary,
    #[serde(rename = "recentLogs")]
    pub recent_logs: Vec<LogEntity>,
}
