use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AiConversation {
    pub id: Uuid,
    pub title: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AiMessage {
    pub id: Uuid,
    pub conversation_id: Uuid,
    pub role: String,
    pub content: String,
    pub thinking_process: Option<String>,
    pub plan: Option<serde_json::Value>,
    pub actions: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AiMemory {
    pub id: Uuid,
    pub category: String,
    pub title: String,
    pub details: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AiTask {
    pub id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct AiAgent {
    pub id: Uuid,
    pub name: String,
    pub role: String,
    pub status: String,
    pub model: String,
    pub system_prompt: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateAiConversationDto {
    pub title: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct SendAiMessageDto {
    pub content: String,
    pub thinking: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct CreateAiMemoryDto {
    pub category: String,
    pub title: String,
    pub details: String,
}

#[derive(Debug, Deserialize)]
pub struct ApproveActionDto {
    #[serde(rename = "approvalId")]
    pub approval_id: String,
    pub status: String,
}
