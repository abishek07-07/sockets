import type { Roles } from "../../utils/database/interface";
import type { BaseSocketHandler } from "../handlers/base-socket.handler";


export interface ISocketFactory {

  getHandler(role : Roles | string): BaseSocketHandler ;
  registerHandler(role: Roles, handler : BaseSocketHandler): void;
}
