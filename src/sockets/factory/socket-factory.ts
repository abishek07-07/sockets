import { RolesConstants } from "../../utils/database/interface";
import type { BaseSocketHandler } from "../handlers/base-socket.handler";
import { DriversSocketHandler } from "../handlers/drivers-socket.handler";
import { StoresSocketHandler } from "../handlers/stores-socket.handler";
import { UsersSocketHandler } from "../handlers/users-socket.handler";
import type { ISocketFactory } from "./interface";

export class SocketFactory implements ISocketFactory {
  private handlers: Map<RolesConstants, BaseSocketHandler> = new Map<
    RolesConstants,
    BaseSocketHandler
  >();

  constructor() {
    this.registerHandler(RolesConstants.STORES, new StoresSocketHandler());
    this.registerHandler(RolesConstants.DRIVERS, new DriversSocketHandler());
    this.registerHandler(RolesConstants.CUSTOMER, new UsersSocketHandler());
  }

  getHandler(role: RolesConstants | string): BaseSocketHandler {
    const mappedRole = this.RolesMapper(role);

    const handler: BaseSocketHandler | undefined =
      this.handlers.get(mappedRole);

    if (handler === undefined)
      throw new Error(`Handler not found for role: ${role}`);

    return handler;
  }

  registerHandler(role: RolesConstants, handler: BaseSocketHandler): void {
    if (!role || !handler) throw new Error("Role and handler are required");
    if (this.handlers.has(role))
      throw new Error(`Handler already registered for role: ${role}`);
    this.handlers.set(role, handler);
  }

  private RolesMapper(role: string): RolesConstants {
    const normalized = role?.trim().toLowerCase();

    if (!normalized) throw new Error(`Handler not found for role: ${role}`);

    if ((Object.values(RolesConstants) as string[]).includes(normalized))
      return normalized as RolesConstants;

    switch (normalized) {
      case "customers":
      case "user":
      case "users":
        return RolesConstants.CUSTOMER;
      case "store":
        return RolesConstants.STORES;
      case "drivers":
        return RolesConstants.DRIVERS;
      default:
        throw new Error(`Handler not found for role: ${role}`);
    }
  }
}
