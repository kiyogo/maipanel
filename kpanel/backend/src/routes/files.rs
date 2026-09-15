use axum::{
    body::Body,
    extract::{Path, Query},
    http::{header, Response, StatusCode},
    Json,
};
use chrono::Utc;
use serde::Deserialize;
use serde_json::json;

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
pub struct FilesQuery {
    pub parent_id: Option<String>,
    pub include_hidden: Option<String>,
    pub scope: Option<String>,
}

pub async fn list_files(
    Query(_query): Query<FilesQuery>,
) -> Json<serde_json::Value> {
    Json(json!({
        "data": [
            {
                "key": "dir-1",
                "id": "dir-1",
                "parentId": null,
                "employeeId": null,
                "name": "www",
                "type": "dir",
                "sizeBytes": 4096,
                "owner": "root",
                "group": "root",
                "permission": "drwxr-xr-x",
                "modified": Utc::now().to_rfc3339(),
                "originModule": "files",
                "isHidden": false,
                "isSystem": true
            },
            {
                "key": "dir-2",
                "id": "dir-2",
                "parentId": null,
                "employeeId": null,
                "name": "backup",
                "type": "dir",
                "sizeBytes": 4096,
                "owner": "kpanel",
                "group": "kpanel",
                "permission": "drwxr-xr-x",
                "modified": Utc::now().to_rfc3339(),
                "originModule": "files",
                "isHidden": false,
                "isSystem": false
            },
            {
                "key": "file-1",
                "id": "file-1",
                "parentId": null,
                "employeeId": null,
                "name": "nginx.conf",
                "type": "file",
                "mime": "text/plain",
                "sizeBytes": 2048,
                "owner": "root",
                "group": "root",
                "permission": "-rw-r--r--",
                "modified": Utc::now().to_rfc3339(),
                "originModule": "files",
                "isHidden": false,
                "isSystem": true
            }
        ],
        "context": {
            "parentId": "",
            "isVirtualEmployeeRoot": false,
            "rootLabel": "/var/kpanel",
            "canShowHidden": true
        }
    }))
}

pub async fn create_folder(
    Json(payload): Json<serde_json::Value>,
) -> (StatusCode, Json<serde_json::Value>) {
    let name = payload.get("name").and_then(|v| v.as_str()).unwrap_or("New Folder");
    let id = format!("dir-{}", uuid::Uuid::new_v4());
    (
        StatusCode::CREATED,
        Json(json!({
            "file": {
                "key": id.clone(),
                "id": id,
                "parentId": payload.get("parentId"),
                "employeeId": null,
                "name": name,
                "type": "dir",
                "sizeBytes": 4096,
                "owner": "kpanel",
                "group": "kpanel",
                "permission": "drwxr-xr-x",
                "modified": Utc::now().to_rfc3339(),
                "originModule": "files",
                "isHidden": false,
                "isSystem": false
            }
        })),
    )
}

pub async fn upload_file() -> (StatusCode, Json<serde_json::Value>) {
    let id = format!("file-{}", uuid::Uuid::new_v4());
    (
        StatusCode::CREATED,
        Json(json!({
            "file": {
                "key": id.clone(),
                "id": id,
                "parentId": null,
                "name": "uploaded_file",
                "type": "file",
                "sizeBytes": 1024,
                "owner": "kpanel",
                "group": "kpanel",
                "permission": "-rw-r--r--",
                "modified": Utc::now().to_rfc3339(),
                "originModule": "files",
                "isHidden": false,
                "isSystem": false
            }
        })),
    )
}

pub async fn update_file(
    Path(id): Path<String>,
    Json(payload): Json<serde_json::Value>,
) -> Json<serde_json::Value> {
    let name = payload.get("name").and_then(|v| v.as_str()).unwrap_or("renamed");
    Json(json!({
        "file": {
            "key": id.clone(),
            "id": id,
            "name": name,
            "type": "file",
            "sizeBytes": 1024,
            "modified": Utc::now().to_rfc3339()
        }
    }))
}

pub async fn update_file_content(
    Path(id): Path<String>,
) -> Json<serde_json::Value> {
    Json(json!({
        "file": {
            "key": id.clone(),
            "id": id,
            "modified": Utc::now().to_rfc3339()
        }
    }))
}

pub async fn delete_file(
    Path(_id): Path<String>,
) -> StatusCode {
    StatusCode::NO_CONTENT
}

pub async fn download_file(
    Path(_id): Path<String>,
) -> Response<Body> {
    Response::builder()
        .header(header::CONTENT_TYPE, "application/octet-stream")
        .header(header::CONTENT_DISPOSITION, "attachment; filename=\"download.txt\"")
        .body(Body::from("Kpanel File Manager - File Content"))
        .unwrap()
}

pub async fn get_share(
    Path(id): Path<String>,
) -> Json<serde_json::Value> {
    Json(json!({
        "share": {
            "id": format!("share-{}", id),
            "fileId": id,
            "token": "demo-share-token",
            "isActive": true,
            "url": "http://localhost:3001/api/v1/files/share/demo-share-token",
            "createdAt": Utc::now().to_rfc3339(),
            "updatedAt": Utc::now().to_rfc3339()
        }
    }))
}

pub async fn save_share(
    Path(id): Path<String>,
    Json(_payload): Json<serde_json::Value>,
) -> Json<serde_json::Value> {
    Json(json!({
        "share": {
            "id": format!("share-{}", id),
            "fileId": id,
            "token": uuid::Uuid::new_v4().to_string(),
            "isActive": true,
            "url": "http://localhost:3001/api/v1/files/share/sample",
            "createdAt": Utc::now().to_rfc3339(),
            "updatedAt": Utc::now().to_rfc3339()
        }
    }))
}

pub async fn get_public_share(
    Path(token): Path<String>,
) -> Json<serde_json::Value> {
    Json(json!({
        "share": {
            "id": "share-sample",
            "fileId": "file-1",
            "token": token,
            "isActive": true,
            "url": format!("http://localhost:3001/api/v1/files/share/{}", token),
            "createdAt": Utc::now().to_rfc3339(),
            "updatedAt": Utc::now().to_rfc3339()
        }
    }))
}

pub async fn download_public_share(
    Path(_token): Path<String>,
) -> Response<Body> {
    Response::builder()
        .header(header::CONTENT_TYPE, "application/octet-stream")
        .header(header::CONTENT_DISPOSITION, "attachment; filename=\"shared_file.txt\"")
        .body(Body::from("Shared File from Kpanel"))
        .unwrap()
}
