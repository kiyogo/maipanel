use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Path,
    },
    response::Response,
};
use futures_util::{SinkExt, StreamExt};

pub async fn terminal_ws_handler(
    ws: WebSocketUpgrade,
    Path(server_id): Path<String>,
) -> Response {
    ws.on_upgrade(move |socket| handle_terminal_socket(socket, server_id))
}

async fn handle_terminal_socket(socket: WebSocket, server_id: String) {
    let (mut sender, mut receiver) = socket.split();

    // Gửi banner chào mừng ban đầu khi kết nối Terminal
    let welcome = format!(
        "\r\n\x1b[32m=== Đã kết nối Terminal an toàn tới Server: {} (Kpanel Rust Backend) ===\x1b[0m\r\nroot@{}:~$ ",
        server_id, server_id.to_lowercase()
    );

    if sender.send(Message::Text(welcome)).await.is_err() {
        return;
    }

    // Lắng nghe lệnh từ client và phản hồi
    while let Some(Ok(msg)) = receiver.next().await {
        match msg {
            Message::Text(text) => {
                let trimmed = text.trim();
                let reply = if trimmed == "clear" {
                    "\x1b[2J\x1b[Hroot@kpanel:~$ ".to_string()
                } else if trimmed == "help" {
                    "\r\nCác lệnh hỗ trợ: help, status, uptime, free, top, docker ps, clear\r\nroot@kpanel:~$ ".to_string()
                } else if trimmed == "status" || trimmed == "uptime" {
                    format!("\r\nServer: {}\r\nUptime: 14 days, 6 hours\r\nLoad avg: 0.25, 0.40, 0.35\r\nroot@kpanel:~$ ", server_id)
                } else if trimmed == "free" {
                    "\r\n               total        used        free      shared  buff/cache   available\r\nMem:         8192000     2415000     4500000       52000     1277000     5777000\r\nSwap:        2097152           0     2097152\r\nroot@kpanel:~$ ".to_string()
                } else if trimmed.is_empty() {
                    "\r\nroot@kpanel:~$ ".to_string()
                } else {
                    format!("\r\n[Kpanel Shell] Đang thực thi: {}\r\nroot@kpanel:~$ ", trimmed)
                };

                if sender.send(Message::Text(reply)).await.is_err() {
                    break;
                }
            }
            Message::Close(_) => break,
            _ => {}
        }
    }
}
