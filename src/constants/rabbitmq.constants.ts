export const RABBITMQ_EXCHANGE = "food_ordering.exchange";
export const RABBITMQ_EXCHANGE_TYPE = "topic" as const;

export const RABBITMQ_ROUTING_KEYS = {
  ORDER_CREATED: "order.created",
  ORDER_STATUS_UPDATED: "order.status.updated",
} as const;

export const RABBITMQ_QUEUES = {
  SOCKETS_ORDER_CREATED: "sockets.order-created.queue",
} as const;
