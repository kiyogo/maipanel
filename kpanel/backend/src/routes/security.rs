use axum::{
    extract::Path,
    http::StatusCode,
    Json,
};
use serde_json::json;

pub async fn get_firewall_rules() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        json!({ "id": "fw-1", "port": 80, "protocol": "TCP", "action": "ALLOW", "source": "0.0.0.0/0", "description": "HTTP Web traffic" }),
        json!({ "id": "fw-2", "port": 443, "protocol": "TCP", "action": "ALLOW", "source": "0.0.0.0/0", "description": "HTTPS SSL traffic" }),
        json!({ "id": "fw-3", "port": 22, "protocol": "TCP", "action": "ALLOW", "source": "192.168.1.0/24", "description": "SSH Admin Management" }),
        json!({ "id": "fw-4", "port": 3001, "protocol": "TCP", "action": "ALLOW", "source": "0.0.0.0/0", "description": "Kpanel API Backend" })
    ])
}

pub async fn add_firewall_rule(
    Json(payload): Json<serde_json::Value>,
) -> (StatusCode, Json<serde_json::Value>) {
    let mut item = payload.clone();
    item["id"] = json!(uuid::Uuid::new_v4().to_string());
    (StatusCode::CREATED, Json(item))
}

pub async fn delete_firewall_rule(
    Path(_id): Path<String>,
) -> StatusCode {
    StatusCode::NO_CONTENT
}

pub async fn get_ssl_certs() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        json!({ "id": "ssl-1", "domain": "cms.example.com", "issuer": "Let's Encrypt", "expiresAt": "2026-12-31", "status": "valid", "autoRenew": true }),
        json!({ "id": "ssl-2", "domain": "blog.example.com", "issuer": "Let's Encrypt", "expiresAt": "2026-11-15", "status": "valid", "autoRenew": true })
    ])
}

pub async fn add_ssl_cert(
    Json(payload): Json<serde_json::Value>,
) -> (StatusCode, Json<serde_json::Value>) {
    let mut item = payload.clone();
    item["id"] = json!(uuid::Uuid::new_v4().to_string());
    item["status"] = json!("issued");
    (StatusCode::CREATED, Json(item))
}
