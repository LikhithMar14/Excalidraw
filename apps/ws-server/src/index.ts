import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

interface User{ 
  ws:WebSocket,
  rooms:string[],
  userId:string
}

const users:User[] = [];

wss.on("connection", function connection(ws, request) {
  const url = request.url;

  if (!url) {
    ws.close();
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

    if (!decoded || !decoded.userId) {
      ws.close();
      return;
    }

    ws.on("message", function message(data) {
      ws.send("pong");
    });
  } catch (err) {
    ws.close();
  }
});
