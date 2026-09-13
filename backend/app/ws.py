import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.security import validate_token
from app.config import settings

router = APIRouter()

WS_IDLE_TIMEOUT = getattr(settings, "WS_IDLE_TIMEOUT", 300)  # 5 min default


class ConnectionManager:
    """Manages active WebSocket connections grouped by user_id."""

    def __init__(self) -> None:
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str) -> None:
        """Accept and register a WebSocket connection for a user."""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str) -> None:
        """Remove a WebSocket connection for a user."""
        if user_id in self.active_connections:
            self.active_connections[user_id] = [
                ws for ws in self.active_connections[user_id] if ws is not websocket
            ]
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_to_user(self, user_id: str, message: dict) -> None:
        """Send a JSON message to all connections of a specific user."""
        if user_id in self.active_connections:
            for conn in self.active_connections[user_id]:
                await conn.send_json(message)

    async def broadcast(self, message: dict) -> None:
        """Send a JSON message to all connected users."""
        for connections in self.active_connections.values():
            for conn in connections:
                await conn.send_json(message)


manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """WebSocket endpoint with JWT authentication on first message.

    Protocol:
    - Client connects and sends first JSON message: {"token": "<clerk-jwt>"}
    - Server validates the token and responds with {"type": "connected", "user_id": "..."}
    - Subsequent messages are processed as JSON payloads
    """
    await websocket.accept()
    user_id: str | None = None

    try:
        # First message must contain authentication token
        data = await websocket.receive_json()
        token = data.get("token")

        if not token:
            await websocket.close(code=4001, reason="Missing token")
            return

        # Validate JWT using existing security module
        try:
            payload = await validate_token(token)
        except ValueError as e:
            await websocket.close(code=4001, reason=f"Invalid token: {e}")
            return

        user_id = payload["sub"]
        await manager.connect(websocket, user_id)

        # Confirm connection
        await websocket.send_json({"type": "connected", "user_id": user_id})

        # Listen for messages with idle timeout
        while True:
            try:
                data = await asyncio.wait_for(
                    websocket.receive_json(), timeout=WS_IDLE_TIMEOUT
                )
            except asyncio.TimeoutError:
                await websocket.close(code=4000, reason="Idle timeout")
                manager.disconnect(websocket, user_id)
                return
            # Echo back for now — handlers will be added per feature
            await websocket.send_json({
                "type": "ack",
                "user_id": user_id,
                "data": data,
            })

    except WebSocketDisconnect:
        if user_id:
            manager.disconnect(websocket, user_id)
    except Exception:
        if user_id:
            manager.disconnect(websocket, user_id)
        try:
            await websocket.close(code=4002, reason="Internal error")
        except Exception:
            pass
