import type { WebSocket } from "ws";
import type { AcceptOrderRequestData, IStores, RejectOrderRequestData } from "../interfaces/stores.interface";
import { BaseSocketHandler } from "./base-socket.handler";
import { OrderItemsStatus, type OrderItemAllocations, type Stores } from "../../utils/database/interface";
import { database } from "../../utils/database";
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


  async acceptOrderRequest(socket: WebSocket, data: AcceptOrderRequestData): Promise<void> {

  }

  async rejectOrderRequest(socket: WebSocket, data: RejectOrderRequestData): Promise<void> {

  }

  public override registerEvents(socket : WebSocket ): void | Promise<void> {


    socket.on("orders:accept-order", (data) => this.acceptOrderRequest(socket, data));
    socket.on("order:reject-order", (data) => this.rejectOrderRequest(socket, data))
  }


  private async SaveDataforAcceptOrder(data: AcceptOrderRequestData, storeId : number ) {

    await database<OrderItemAllocations>("order_item_allocations").insert({
      order_item_id: data.orderID,
      store_id: storeId,
      allocated_quantity: data.quantity,
      status: OrderItemsStatus.PENDING,
      price : 1000, // dummy data for now
    });
  }


  private async findStoreIdofUser(id: string): Promise<number> {

    const res = await database<Stores>("stores")
      .leftJoin("users", "stores.owner_id", "users.id")
      .where("users.uid", id)
      .select("stores.id")
      .first();
    return res.id;

  }

}
