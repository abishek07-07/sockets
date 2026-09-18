import type { WebSocket } from "ws";
import type { BaseSocket } from "../interfaces";


export abstract  class BaseSocketHandler implements BaseSocket {

  public abstract socketHandlerName: string;

  async handleConnection(socket: WebSocket): Promise<void> {

  }

  async handleDisConnection(socket: WebSocket): Promise<void> {

  }

  public abstract getSocketHandlerName(): string;

  public abstract registerEvents(socket : WebSocket): void  |  Promise<void >


}
