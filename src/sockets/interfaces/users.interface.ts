import type { WebSocket } from "ws";

export interface IUsers {
  sendOrder(socket: WebSocket, data: any): Promise<void>;
}
