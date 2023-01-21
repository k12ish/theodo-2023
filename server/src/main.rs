use std::{net::SocketAddr, path::PathBuf};

use tower_http::{
    services::ServeDir,
    trace::{DefaultMakeSpan, TraceLayer},
};

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        TypedHeader,
    },
    http::StatusCode,
    response::IntoResponse,
    response::Response,
    routing::get,
    routing::get_service,
    Extension, Router,
};

use std::borrow::Cow;
use std::ops::ControlFlow;

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

//allows to extract the IP of connecting user
use axum::extract::connect_info::ConnectInfo;
use axum::extract::ws::CloseFrame;

//allows to split the websocket stream into separate TX and RX branches
use futures::{sink::SinkExt, stream::StreamExt};

use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone)]
struct State {
    x: usize,
}

async fn handler(
    ws: WebSocketUpgrade,
    Extension(state): Extension<Arc<RwLock<State>>>,
) -> Response {
    ws.on_failed_upgrade(|error| tracing::error!("{}", error))
        .on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: Arc<RwLock<State>>) {
    // send a ping just to start off
    if let Ok(_) = socket.send(Message::Ping(vec![1, 2, 3])).await {
        tracing::debug!("Pinged ...",);
    } else {
        tracing::debug!("Could not send ping!");
        return;
    }

    // receive single message from a client (we can either receive or send with socket).
    // this will likely be the Pong for our Ping or a hello message from client.
    // waiting for message from a client will block this task, but will not block other client's
    // connections.
    if let Some(msg) = socket.recv().await {
        if let Ok(msg) = msg {
            if process_message(msg).is_break() {
                return;
            }
        } else {
            println!("client abruptly disconnected",);
            return;
        }
    }

    for _ in 1..5 {
        let message = {
            let mut s = state.clone().write_owned().await;
            s.x += 1;
            Message::Text(String::from(format!("This is the {}th message!", s.x)))
        };

        if socket.send(message).await.is_err() {
            println!("client abruptly disconnected",);
            return;
        }
        tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    }
}

fn process_message(msg: Message) -> ControlFlow<(), ()> {
    match msg {
        Message::Text(t) => {
            println!(">>> sent str: {:?}", t);
        }
        Message::Binary(d) => {
            println!(">>>  sent {} bytes: {:?}", d.len(), d);
        }
        Message::Close(c) => {
            if let Some(cf) = c {
                println!(
                    ">>> sent close with code {} and reason `{}`",
                    cf.code, cf.reason
                );
            } else {
                println!(">>> somehow sent close message without CloseFrame",);
            }
            return ControlFlow::Break(());
        }

        Message::Pong(v) => {
            println!(">>> sent pong with {:?}", v);
        }
        // You should never need to manually handle Message::Ping, as axum's websocket library
        // will do so for you automagically by replying with Pong and copying the v according to
        // spec. But if you need the contents of the pings you can see them here.
        Message::Ping(v) => {
            println!(">>> sent ping with {:?}", v);
        }
    }
    ControlFlow::Continue(())
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_websockets=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let assets_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("theodo")
        .join("public");
    let app = Router::new()
        .fallback_service(
            get_service(ServeDir::new(assets_dir).append_index_html_on_directories(true))
                .handle_error(|error: std::io::Error| async move {
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Unhandled internal error: {}", error),
                    )
                }),
        )
        .route("/ws", get(handler))
        .layer(Extension(Arc::new(RwLock::new(State { x: 0 }))))
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::default().include_headers(true)),
        );
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
