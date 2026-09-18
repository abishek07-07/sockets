import knex from "knex";

export const database = knex({
  client: process.env.DATABASE_CLIENT ?? "pg",
  connection: process.env.DATABASE_URL ?? {
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 5432),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});
