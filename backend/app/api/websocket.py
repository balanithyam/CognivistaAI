import logging
import json
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger("cognivista.websocket")
router = APIRouter(tags=["WebSockets"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        logger.info("WebSocket connected for user: %s", user_id)

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info("WebSocket disconnected for user: %s", user_id)

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            data = json.dumps(message)
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(data)
                except Exception as e:
                    logger.warning("Error sending WS message: %s", e)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                event_type = payload.get("type", "ping")
                if event_type == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
            except Exception:
                await websocket.send_text(json.dumps({"type": "ack"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        logger.warning("WS session error: %s", e)
        manager.disconnect(websocket, user_id)
