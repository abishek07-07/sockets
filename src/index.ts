import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { database } from "./utils/database";
import { decodeToken, type TokenRequest } from "./utils/jsonwebtokenn/jwt";
import type { JwtPayload } from "jsonwebtoken";
import { SocketFactory } from "./sockets/factory/socket-factory";
import { consumeQueue } from "./utils/rabbitmq";
import {
  RABBITMQ_QUEUES,
  RABBITMQ_ROUTING_KEYS,
} from "./constants/rabbitmq.constants";
import type { BaseSocketHandler } from "./sockets/handlers/base-socket.handler";
import type { Users } from "./utils/database/interface";
const allowedorigins = ["http://localhost:5173"];

const wss = new WebSocketServer({
  port: Number(process.env.PORT ?? "8000"),
  verifyClient: ({ origin }) => {
    return allowedorigins.includes(origin);
  },
});

const factory = new SocketFactory();
wss.on("connection", async (socket: WebSocket, request: IncomingMessage) => {
  console.log("The connection for the user is established");

  try {
    const requestUrl = new URL(
      request.url ?? "/",
      `http://${request.headers.host ?? "localhost"}`,
    );

    const token = requestUrl.searchParams.get("token");

    console.log("The token received is ", token);

    if (token == null) {
      socket.close(1008, "token is required");
      return;
    }

    let verificationtoken: (TokenRequest & Partial<JwtPayload>) | null;
    try {
      verificationtoken = decodeToken(token) as
        (TokenRequest & Partial<JwtPayload>) | null;
    } catch {
      socket.close(1008, "invalid token");
      return;
    }

    if (
      !verificationtoken ||
      typeof verificationtoken !== "object" ||
      !verificationtoken.uid
    ) {
      socket.close(1008, "invalid token");
      return;
    }

    const roleofUser = await findRoleofUser(verificationtoken.uid);

    if (roleofUser == null) {
      socket.close(1008, "role not found for user");
      return;
    }

    socket.userId = verificationtoken.uid;

    const handler: BaseSocketHandler = factory.getHandler(roleofUser as string);

    await handler.handleConnection(socket);
    await handler.registerEvents(socket);

    socket.on("close", () => {
      handler
        .handleDisConnection(socket)
        .catch((err) => console.error("disconnect error:", err));
    });
  } catch (err) {
    console.error("connection error:", err);
    try {
      socket.close(1011, "internal error");
    } catch {
      /* already closed */
    }
  }
});

export { wss };

void consumeQueue(
  RABBITMQ_QUEUES.SOCKETS_ORDER_CREATED,
  RABBITMQ_ROUTING_KEYS.ORDER_CREATED,
  (msg) => {
    const payload = JSON.stringify({
      event: RABBITMQ_ROUTING_KEYS.ORDER_CREATED,
      data: msg,
    });
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    }
  },
).catch((err) => console.error("rabbitmq consume failed:", err));

export const findRoleofUser = async (
  uid: string,
): Promise<{ roleName: string } | undefined> => {
  const row = await database<Users>("users as u")
    .leftJoin("user_roles as ur", "ur.user_id", "u.id")
    .leftJoin("roles as r", "r.id", "ur.role_id")
    .where("u.slug", uid)
    .select({
      name: "r.name",
    })
    .first();
  console.log(row);

  return row?.name;
};
