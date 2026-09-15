pub mod auth;
pub mod servers;
pub mod projects;
pub mod databases;
pub mod users;
pub mod dashboard;
pub mod logs;
pub mod ai;
pub mod files;
pub mod security;
pub mod backup;
pub mod ws;

use axum::{
    routing::{delete, get, patch, post, put},
    Router,
};
use crate::state::AppState;

pub fn create_router() -> Router<AppState> {
    let api_routes = Router::new()
        // Auth
        .route("/auth/login", post(auth::login))
        .route("/auth/profile", get(auth::get_profile))

        // Dashboard
        .route("/dashboard/stats", get(dashboard::get_stats))

        // Servers
        .route("/servers", get(servers::get_all).post(servers::create))
        .route("/servers/summary", get(servers::get_summary))
        .route("/servers/:id", get(servers::get_one).patch(servers::update).delete(servers::remove))

        // Projects
        .route("/projects", get(projects::get_all).post(projects::create))
        .route("/projects/summary", get(projects::get_summary))
        .route("/projects/:id", get(projects::get_one).patch(projects::update).delete(projects::remove))

        // Databases
        .route("/databases", get(databases::get_all).post(databases::create))
        .route("/databases/:id", get(databases::get_one).patch(databases::update).delete(databases::remove))

        // Users
        .route("/users", get(users::get_all).post(users::create))
        .route("/users/:id", get(users::get_one).patch(users::update).delete(users::remove))

        // Logs
        .route("/logs", get(logs::get_all).post(logs::create).delete(logs::clear))

        // AI Center
        .route("/ai/conversations", get(ai::get_conversations).post(ai::create_conversation))
        .route("/ai/conversations/:id", delete(ai::delete_conversation))
        .route("/ai/conversations/:id/messages", get(ai::get_messages).post(ai::send_message))
        .route("/ai/tasks", get(ai::get_tasks))
        .route("/ai/agents", get(ai::get_agents))
        .route("/ai/models", get(ai::get_models))
        .route("/ai/permissions", get(ai::get_permissions))
        .route("/ai/approvals", get(ai::get_approvals))
        .route("/ai/messages/:messageId/approve", post(ai::approve_action))
        .route("/ai/tools", get(ai::get_tools))
        .route("/ai/memories", get(ai::get_memories).post(ai::create_memory))
        .route("/ai/memories/:id", delete(ai::delete_memory))
        .route("/ai/workspaces", get(ai::get_workspaces))
        .route("/ai/workspaces/:id/scan", post(ai::scan_workspace))
        .route("/ai/logs", get(ai::get_ai_logs))

        // Files
        .route("/files", get(files::list_files))
        .route("/files/folders", post(files::create_folder))
        .route("/files/upload", post(files::upload_file))
        .route("/files/:id", patch(files::update_file).delete(files::delete_file))
        .route("/files/:id/content", put(files::update_file_content))
        .route("/files/:id/download", get(files::download_file))
        .route("/files/:id/share", get(files::get_share).post(files::save_share).patch(files::save_share))
        .route("/files/share/:token", get(files::get_public_share))
        .route("/files/share/:token/download", get(files::download_public_share))

        // Security
        .route("/security/firewall", get(security::get_firewall_rules).post(security::add_firewall_rule))
        .route("/security/firewall/:id", delete(security::delete_firewall_rule))
        .route("/security/ssl", get(security::get_ssl_certs).post(security::add_ssl_cert))

        // Backup
        .route("/backup", get(backup::list_backups))
        .route("/backup/:type/:id", post(backup::create_backup))

        // WebSocket
        .route("/ws/terminal/:id", get(ws::terminal_ws_handler));

    Router::new()
        .nest("/api/v1", api_routes.clone())
        .nest("/api", api_routes)
        // Healthcheck
        .route("/health", get(|| async { "OK (Kpanel Rust Backend)" }))
}
