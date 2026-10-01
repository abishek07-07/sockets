import type { RolesConstants } from "../../utils/database/interface";
import type { BaseSocketHandler } from "../handlers/base-socket.handler";

export interface ISocketFactory {
  getHandler(role: RolesConstants | string): BaseSocketHandler;
  registerHandler(role: RolesConstants, handler: BaseSocketHandler): void;
}
