CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE users_roles_enum AS ENUM (
    'customer',
    'driver',
    'stores',
    'admin'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(200) NOT NULL,
    password VARCHAR(255) NOT NULL,
    uid UUID NOT NULL DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    roles users_roles_enum NOT NULL DEFAULT 'customer'
);


INSERT INTO USERS(username, email, password, roles ) values (
    ('customer', 'customer@example.com', '$2a$12$/u/FRT./SH73r5JkLBoFs.x/bGlxlb9mKg6Kx9sctulVx3swCq3o.', 'customer'),
    ('driver', 'driver@example.com', '$2a$12$/u/FRT./SH73r5JkLBoFs.x/bGlxlb9mKg6Kx9sctulVx3swCq3o.', 'driver'),
    ('stores', 'stores@example.com', '$2a$12$/u/FRT./SH73r5JkLBoFs.x/bGlxlb9mKg6Kx9sctulVx3swCq3o.', 'stores'),
    ('admin', 'admin@example.com', '$2a$12$/u/FRT./SH73r5JkLBoFs.x/bGlxlb9mKg6Kx9sctulVx3swCq3o.', 'admin')


)
