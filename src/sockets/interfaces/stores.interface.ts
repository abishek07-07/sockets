import { WebSocket }  from "ws"

export interface IStores {

  acceptOrderRequest(socket : WebSocket , data : AcceptOrderRequestData ) : Promise<void>
  rejectOrderRequest(socket : WebSocket , data : RejectOrderRequestData ) : Promise<void>

}


export interface AcceptOrderRequestData  {
  orderID: number,
  productId: number,
  quantity : number
}

export interface RejectOrderRequestData {
  orderID: number
}
