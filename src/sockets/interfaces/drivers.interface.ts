import type { WebSocket } from "ws";

export interface IDrivers {
  acceptDriverRequest(socket: WebSocket, data: any): Promise<void>;
  rejectDriverRequest(socket: WebSocket, data: any): Promise<void>;
}
