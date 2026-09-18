import type { WebSocket } from "ws";
import type { IDrivers } from "../interfaces/drivers.interface";
import { BaseSocketHandler } from "./base-socket.handler";

export class DriversSocketHandler extends BaseSocketHandler implements IDrivers {
  public driversSocket: Map<string, Set<WebSocket>> = new Map();
  public override socketHandlerName: string = 'DriversSocket';

  public override getSocketHandlerName(): string {
    return this.socketHandlerName;
  }

  public override async handleConnection(socket: WebSocket): Promise<void> {
    if (!socket.userId) return;
    let set = this.driversSocket.get(socket.userId);
    if (!set) this.driversSocket.set(socket.userId, (set = new Set()));
    set.add(socket);
  }

  public override async handleDisConnection(socket: WebSocket): Promise<void> {
    if (!socket.userId) return;
    const set = this.driversSocket.get(socket.userId);
    set?.delete(socket);
    if (set && set.size === 0) this.driversSocket.delete(socket.userId);
  }

  async acceptDriverRequest(socket: WebSocket, data: any): Promise<void> {

  }

  async rejectDriverRequest(socket: WebSocket, data: any): Promise<void> {

  }

  public override registerEvents(socket: WebSocket): void | Promise<void> {
    socket.on("driver:accept-request", (data) => this.acceptDriverRequest(socket, data));
    socket.on("driver:reject-request", (data) => this.rejectDriverRequest(socket, data));
  }
}
