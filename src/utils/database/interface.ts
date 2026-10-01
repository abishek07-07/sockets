export interface Users {
  id: number;
  username: string;
  email: string;
  password: string;
  uid: string;
}

export interface OrderItemAllocations {
  id: number;
  order_item_id: number;
  store_id: number;
  allocated_quantity: number;
  price: number;
  status: OrderItemsStatus;
}

export enum OrderItemsStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed ",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface Stores {
  id: number;
  registration_number: string;
  owner_id: number;
  latitude: string;
  longitude: string;
}

export interface Roles {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface UserRoles {
  id: number;
  user_id: number;
  role_id: number;
  created_at: Date;
}

export enum RolesConstants {
  STORES = "storeskeeper",
  DRIVERS = "driver",
  CUSTOMER = "customer",
}
