use axum::{
    extract::Path,
    http::StatusCode,
    Json,
};
use chrono::Utc;
use serde_json::json;

pub async fn list_backups() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        json!({ "id": "bk-1", "name": "backup_shop_db_2026_09_14.sql.gz", "type": "database", "target": "shop_db", "size": "45 MB", "createdAt": "2026-09-14 02:00:00" }),
        json!({ "id": "bk-2", "name": "backup_vps_sg_full.tar.gz", "type": "server", "target": "VPS-SG-01", "size": "1.2 GB", "createdAt": "2026-09-10 03:30:00" })
    ])
}

pub async fn create_backup(
    Path((backup_type, id)): Path<(String, String)>,
) -> (StatusCode, Json<serde_json::Value>) {
    let now = Utc::now().format("%Y%m%d_%H%M%S").to_string();
    let filename = format!("backup_{}_{}_{}.tar.gz", backup_type, id, now);
    (
        StatusCode::CREATED,
        Json(json!({
            "id": uuid::Uuid::new_v4().to_string(),
            "name": filename,
            "type": backup_type,
            "target": id,
            "size": "50 MB",
            "status": "completed",
            "createdAt": Utc::now().to_rfc3339()
        })),
    )
}
