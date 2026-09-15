use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use serde_json::json;
use uuid::Uuid;
use crate::{
    error::AppError,
    models::ai::{
        AiAgent, AiConversation, AiMemory, AiMessage, AiTask, ApproveActionDto,
        CreateAiConversationDto, CreateAiMemoryDto, SendAiMessageDto,
    },
    state::AppState,
};

// Conversations
pub async fn get_conversations(
    State(state): State<AppState>,
) -> Result<Json<Vec<AiConversation>>, AppError> {
    let convs = sqlx::query_as::<_, AiConversation>(
        "SELECT * FROM ai_conversations ORDER BY updated_at DESC",
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(convs))
}

pub async fn create_conversation(
    State(state): State<AppState>,
    Json(payload): Json<CreateAiConversationDto>,
) -> Result<(StatusCode, Json<AiConversation>), AppError> {
    let title = payload
        .title
        .filter(|t| !t.trim().is_empty())
        .unwrap_or_else(|| "Cuộc hội thoại mới".to_string());
    let new_id = Uuid::new_v4();
    let now = Utc::now();

    let conv = sqlx::query_as::<_, AiConversation>(
        r#"
        INSERT INTO ai_conversations (id, title, created_at, updated_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        "#,
    )
    .bind(new_id)
    .bind(&title)
    .bind(now)
    .bind(now)
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(conv)))
}

pub async fn delete_conversation(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    sqlx::query("DELETE FROM ai_conversations WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await?;

    Ok(Json(json!({ "success": true })))
}

// Messages
pub async fn get_messages(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<AiMessage>>, AppError> {
    let msgs = sqlx::query_as::<_, AiMessage>(
        "SELECT * FROM ai_messages WHERE conversation_id = $1 ORDER BY created_at ASC",
    )
    .bind(id)
    .fetch_all(&state.db)
    .await?;

    Ok(Json(msgs))
}

pub async fn send_message(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<SendAiMessageDto>,
) -> Result<Json<AiMessage>, AppError> {
    let now = Utc::now();

    // 1. Lưu tin nhắn của User
    let user_msg_id = Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO ai_messages (id, conversation_id, role, content, created_at)
        VALUES ($1, $2, 'user', $3, $4)
        "#,
    )
    .bind(user_msg_id)
    .bind(id)
    .bind(&payload.content)
    .bind(now)
    .execute(&state.db)
    .await?;

    // 2. Tạo phản hồi trợ lý (AI Assistant Response)
    let ai_msg_id = Uuid::new_v4();
    let thinking_text = if payload.thinking.unwrap_or(true) {
        Some("Đang phân tích yêu cầu, kiểm tra cấu hình máy chủ và tài nguyên hệ thống Kpanel...".to_string())
    } else {
        None
    };

    let reply_content = format!(
        "Tôi đã nhận được lệnh: \"{}\". Hệ thống Kpanel Backend (Rust + Axum + Tokio) đang hoạt động ổn định và sẵn sàng xử lý các tác vụ quản trị máy chủ.",
        payload.content
    );

    let ai_msg = sqlx::query_as::<_, AiMessage>(
        r#"
        INSERT INTO ai_messages (id, conversation_id, role, content, thinking_process, created_at)
        VALUES ($1, $2, 'assistant', $3, $4, $5)
        RETURNING *
        "#,
    )
    .bind(ai_msg_id)
    .bind(id)
    .bind(&reply_content)
    .bind(&thinking_text)
    .bind(Utc::now())
    .fetch_one(&state.db)
    .await?;

    // Cập nhật updated_at của cuộc hội thoại
    sqlx::query("UPDATE ai_conversations SET updated_at = $1 WHERE id = $2")
        .bind(Utc::now())
        .bind(id)
        .execute(&state.db)
        .await?;

    Ok(Json(ai_msg))
}

// Tasks
pub async fn get_tasks(
    State(state): State<AppState>,
) -> Result<Json<Vec<AiTask>>, AppError> {
    let tasks = sqlx::query_as::<_, AiTask>(
        "SELECT * FROM ai_tasks ORDER BY created_at DESC",
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(tasks))
}

// Agents
pub async fn get_agents(
    State(state): State<AppState>,
) -> Result<Json<Vec<AiAgent>>, AppError> {
    let agents = sqlx::query_as::<_, AiAgent>(
        "SELECT * FROM ai_agents ORDER BY created_at ASC",
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(agents))
}

// Models
pub async fn get_models() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        json!({ "id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "provider": "Google", "speed": "Nhanh", "context": "1M tokens" }),
        json!({ "id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash", "provider": "Google", "speed": "Cực nhanh", "context": "1M tokens" }),
        json!({ "id": "claude-3-5-sonnet", "name": "Claude 3.5 Sonnet", "provider": "Anthropic", "speed": "Nhanh", "context": "200K tokens" }),
        json!({ "id": "gpt-4o", "name": "GPT-4o", "provider": "OpenAI", "speed": "Rất nhanh", "context": "128K tokens" })
    ])
}

// Permissions
pub async fn get_permissions() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        json!({ "id": "read_files", "name": "Đọc tệp tin", "granted": true }),
        json!({ "id": "write_files", "name": "Ghi/Sửa tệp tin", "granted": true }),
        json!({ "id": "execute_commands", "name": "Thực thi lệnh Terminal", "granted": false }),
        json!({ "id": "manage_services", "name": "Quản lý Service/Docker", "granted": true })
    ])
}

// Approvals
pub async fn get_approvals() -> Json<Vec<serde_json::Value>> {
    Json(vec![])
}

pub async fn approve_action(
    Path(_message_id): Path<String>,
    Json(payload): Json<ApproveActionDto>,
) -> Json<serde_json::Value> {
    Json(json!({
        "success": true,
        "approvalId": payload.approval_id,
        "status": payload.status
    }))
}

// Tools
pub async fn get_tools() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        json!({ "name": "read_file", "description": "Đọc tệp tin trong workspace", "requiresApproval": false }),
        json!({ "name": "write_file", "description": "Ghi/Sửa đổi nội dung tệp tin", "requiresApproval": false }),
        json!({ "name": "create_project", "description": "Tạo dự án mới trên máy chủ", "requiresApproval": true }),
        json!({ "name": "delete_project", "description": "Xóa vĩnh viễn dự án khỏi hệ thống", "requiresApproval": true }),
        json!({ "name": "create_database", "description": "Tạo cơ sở dữ liệu mới", "requiresApproval": true }),
        json!({ "name": "delete_database", "description": "Xóa vĩnh viễn cơ sở dữ liệu", "requiresApproval": true }),
        json!({ "name": "deploy_project", "description": "Triển khai dự án production", "requiresApproval": true }),
        json!({ "name": "restart_service", "description": "Khởi động lại các tiến trình hệ thống", "requiresApproval": true })
    ])
}

// Memories
pub async fn get_memories(
    State(state): State<AppState>,
) -> Result<Json<Vec<AiMemory>>, AppError> {
    let memories = sqlx::query_as::<_, AiMemory>(
        "SELECT * FROM ai_memories ORDER BY created_at DESC",
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(memories))
}

pub async fn create_memory(
    State(state): State<AppState>,
    Json(payload): Json<CreateAiMemoryDto>,
) -> Result<(StatusCode, Json<AiMemory>), AppError> {
    let new_id = Uuid::new_v4();
    let now = Utc::now();

    let memory = sqlx::query_as::<_, AiMemory>(
        r#"
        INSERT INTO ai_memories (id, category, title, details, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        "#,
    )
    .bind(new_id)
    .bind(&payload.category)
    .bind(&payload.title)
    .bind(&payload.details)
    .bind(now)
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(memory)))
}

pub async fn delete_memory(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, AppError> {
    sqlx::query("DELETE FROM ai_memories WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await?;

    Ok(Json(json!({ "success": true })))
}

// Workspaces
pub async fn get_workspaces() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        json!({ "id": "default", "name": "Default VPS Workspace", "path": "/var/www", "filesCount": 128, "lastScan": "Vừa xong" }),
        json!({ "id": "docker-stack", "name": "Docker Compose Workspace", "path": "/opt/kpanel", "filesCount": 42, "lastScan": "Hôm nay" })
    ])
}

pub async fn scan_workspace(
    Path(id): Path<String>,
) -> Json<serde_json::Value> {
    Json(json!({
        "success": true,
        "workspaceId": id,
        "scannedFiles": 128,
        "status": "completed"
    }))
}

// Logs
pub async fn get_ai_logs() -> Json<Vec<serde_json::Value>> {
    Json(vec![
        json!({ "id": "1", "timestamp": "Vừa xong", "level": "INFO", "agent": "Kiyo Devops AI", "action": "Kiểm tra trạng thái server VPS-SG-01" }),
        json!({ "id": "2", "timestamp": "5 phút trước", "level": "INFO", "agent": "Security Auditor", "action": "Quét các cổng kết nối mở" })
    ])
}
