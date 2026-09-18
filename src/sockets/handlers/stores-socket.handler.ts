import type { WebSocket } from "ws";
import type { IStores } from "../interfaces/stores.interface";
import { BaseSocketHandler } from "./base-socket.handler";

export class StoresSocketHandler extends BaseSocketHandler implements IStores {
  public storesSocket: Map<string, Set<WebSocket>> = new Map();
  public override socketHandlerName: string = 'StoresSocket';

  public override getSocketHandlerName(): string {
    return this.socketHandlerName;
  }

  public override async handleConnection(socket: WebSocket): Promise<void> {
    if (!socket.userId) return;
    let set = this.storesSocket.get(socket.userId);
    if (!set) this.storesSocket.set(socket.userId, (set = new Set()));
    set.add(socket);
  }


  override async handleDisConnection(socket: WebSocket): Promise<void> {
    if (!socket.userId) return;
    const set = this.storesSocket.get(socket.userId);
    set?.delete(socket);
    if (set && set.size === 0) this.storesSocket.delete(socket.userId);
  }


  async acceptOrderRequest(socket: WebSocket, data: any): Promise<void> {

  }

  async rejectOrderRequest(socket: WebSocket, data: any): Promise<void> {

  }

  public override registerEvents(socket : WebSocket ): void | Promise<void> {


    socket.on("orders:accept-order", (data) => this.acceptOrderRequest(socket, data));
    socket.on("order:reject-order", (data) => this.rejectOrderRequest(socket, data))
  }


}
