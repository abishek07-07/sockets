import type { WebSocket } from "ws";
import type { IUsers } from "../interfaces/users.interface";
import { BaseSocketHandler } from "./base-socket.handler";

export class UsersSocketHandler extends BaseSocketHandler implements IUsers {
  public usersSocket: Map<string, Set<WebSocket>> = new Map();
  public override socketHandlerName: string = "UsersSocket";

  public override getSocketHandlerName(): string {
    return this.socketHandlerName;
  }

  public override async handleConnection(socket: WebSocket): Promise<void> {
    console.log("The connection is being handled in usersockethandler");
    if (!socket.userId) return;
    let set = this.usersSocket.get(socket.userId);
    if (!set) this.usersSocket.set(socket.userId, (set = new Set()));
    set.add(socket);
    console.log(this.usersSocket.get(socket.userId));
  }

  public override async handleDisConnection(socket: WebSocket): Promise<void> {
    if (!socket.userId) return;
    const set = this.usersSocket.get(socket.userId);
    set?.delete(socket);
    if (set && set.size === 0) this.usersSocket.delete(socket.userId);
  }

  async sendOrder(socket: WebSocket, data: any): Promise<void> {}

  public override registerEvents(socket: WebSocket): void | Promise<void> {
    socket.on("orders:send-order", (data) => this.sendOrder(socket, data));
  }
}
