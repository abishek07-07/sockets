import amqp, { type Channel, type ConsumeMessage } from "amqplib";
import {
  RABBITMQ_EXCHANGE,
  RABBITMQ_EXCHANGE_TYPE,
} from "../../constants/rabbitmq.constants";

let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
let channel: Channel | null = null;

function rabbitmqUrl(): string {
  return (
    process.env.RABBITMQ_URL ??
    `amqp://${process.env.RABBITMQ_USER ?? "guest"}:${process.env.RABBITMQ_PASSWORD ?? "guest"}@${process.env.RABBITMQ_HOST ?? "localhost"}:${process.env.RABBITMQ_PORT ?? "5672"}`
  );
}

export async function getRabbitChannel(): Promise<Channel> {
  if (channel) return channel;
  connection ??= await amqp.connect(rabbitmqUrl());
  channel = await connection.createChannel();
  await channel.assertExchange(
    RABBITMQ_EXCHANGE,
    RABBITMQ_EXCHANGE_TYPE,
    { durable: true },
  );
  return channel;
}

export async function publishEvent(
  routingKey: string,
  payload: unknown,
): Promise<void> {
  const ch = await getRabbitChannel();
  ch.publish(
    RABBITMQ_EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true },
  );
}

export async function consumeQueue(
  queue: string,
  routingKey: string,
  onMessage: (msg: unknown, raw: ConsumeMessage) => void | Promise<void>,
): Promise<void> {
  const ch = await getRabbitChannel();
  await ch.assertQueue(queue, { durable: true });
  await ch.bindQueue(queue, RABBITMQ_EXCHANGE, routingKey);
  await ch.consume(queue, (raw) => {
    if (!raw) return;
    try {
      const parsed: unknown = JSON.parse(raw.content.toString());
      void Promise.resolve(onMessage(parsed, raw)).then(
        () => ch.ack(raw),
        (err) => {
          console.error("rabbitmq consumer error:", err);
          ch.nack(raw, false, false);
        },
      );
    } catch (err) {
      console.error("rabbitmq invalid message:", err);
      ch.nack(raw, false, false);
    }
  });
}

export async function closeRabbitMQ(): Promise<void> {
  try {
    await channel?.close();
  } finally {
    channel = null;
  }
  try {
    await connection?.close();
  } finally {
    connection = null;
  }
}
