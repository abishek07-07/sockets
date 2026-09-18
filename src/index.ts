import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { database } from "./utils/database";
import { decodeToken, type TokenRequest } from "./utils/jsonwebtokenn/jwt";
import type { JwtPayload } from "jsonwebtoken";
import { SocketFactory } from "./sockets/factory/socket-factory";
import type { BaseSocketHandler } from "./sockets/handlers/base-socket.handler";

const wss = new WebSocketServer({ port: Number(process.env.PORT ?? '8000') });

const factory = new SocketFactory();
wss.on('connection', async  (socket : WebSocket, request: IncomingMessage) => {
  console.log('The connection for the user is established')

  try {
    const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

    const token = requestUrl.searchParams.get("token");

    if (token == null) {
      socket.close(1008, 'token is required');
      return;
    }

    let verificationtoken: (TokenRequest & Partial<JwtPayload>) | null;
    try {
      verificationtoken = decodeToken(token) as (TokenRequest & Partial<JwtPayload>) | null;
    } catch {
      socket.close(1008, 'invalid token');
      return;
    }

    if (!verificationtoken || typeof verificationtoken !== 'object' || !verificationtoken.uid) {
      socket.close(1008, 'invalid token');
      return;
    }

    const roleofUser = await findRoleofUser(verificationtoken.uid);

    if (roleofUser == null) {
      socket.close(1008, 'role not found for user');
      return;
    }

    socket.userId = verificationtoken.uid;

    const handler: BaseSocketHandler = factory.getHandler(roleofUser);

    await handler.handleConnection(socket);
    await handler.registerEvents(socket);

    socket.on('close', () => {
      handler.handleDisConnection(socket).catch((err) => console.error('disconnect error:', err));
    });
  } catch (err) {
    console.error('connection error:', err);
    try { socket.close(1011, 'internal error'); } catch { /* already closed */ }
  }
})

export { wss };


export const findRoleofUser= async (uid: string) : Promise<string | undefined> => {

  const row = await database('users')
    .select('role')
    .where('uid', uid)
    .first();


  return row?.role;


}
