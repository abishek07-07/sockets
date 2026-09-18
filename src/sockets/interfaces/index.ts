import type { WebSocket } from "ws"

export interface BaseSocket  {
  handleConnection(socket: WebSocket): Promise<void>
  handleDisConnection(socket : WebSocket) : Promise<void>


}
