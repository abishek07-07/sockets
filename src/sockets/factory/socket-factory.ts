import { Roles } from "../../utils/database/interface";
import type { BaseSocketHandler } from "../handlers/base-socket.handler";
import { DriversSocketHandler } from "../handlers/drivers-socket.handler";
import { StoresSocketHandler } from "../handlers/stores-socket.handler";
import { UsersSocketHandler } from "../handlers/users-socket.handler";
import type { ISocketFactory } from "./interface";


export class SocketFactory implements ISocketFactory {

  private handlers: Map<Roles, BaseSocketHandler> = new Map<Roles, BaseSocketHandler>();

  constructor() {
    this.registerHandler(Roles.STORES, new StoresSocketHandler());
    this.registerHandler(Roles.DRIVERS, new DriversSocketHandler());
   this.registerHandler(Roles.CUSTOMER, new UsersSocketHandler());
  }

  getHandler(role: Roles | string): BaseSocketHandler {
    const mappedRole = this.RolesMapper(role);

    const handler: BaseSocketHandler | undefined = this.handlers.get(mappedRole);

    if (handler === undefined) throw new Error(`Handler not found for role: ${role}`);

    return handler;
  }

  registerHandler(role: Roles, handler: BaseSocketHandler): void {
    if (!role || !handler) throw new Error('Role and handler are required');
    if (this.handlers.has(role)) throw new Error(`Handler already registered for role: ${role}`);
    this.handlers.set(role, handler);
  }

  private RolesMapper(role: string): Roles {
    const normalized = role?.trim().toLowerCase();

    if (!normalized) throw new Error(`Handler not found for role: ${role}`);

    if ((Object.values(Roles) as string[]).includes(normalized)) return normalized as Roles;

    switch (normalized) {
      case "customers":
      case "user":
      case "users":
        return Roles.CUSTOMER;
      case "store":
        return Roles.STORES;
      case "drivers":
        return Roles.DRIVERS;
      default:
        throw new Error(`Handler not found for role: ${role}`);
    }
  }

}
