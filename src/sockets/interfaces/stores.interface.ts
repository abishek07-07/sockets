import { WebSocket }  from "ws"

export interface IStores {

  acceptOrderRequest(socket : WebSocket , data : any ) : Promise<void>
  rejectOrderRequest(socket : WebSocket , data : any ) : Promise<void>

}
