const pool = require('../models/db');

async function createSchema() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Users" (
            "id" SERIAL PRIMARY KEY,
            "username" VARCHAR(80) UNIQUE NOT NULL,
            "password" VARCHAR(120) NOT NULL,
            "full_name" VARCHAR(120) NOT NULL,
            "email" VARCHAR(160) UNIQUE NOT NULL,
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "Products" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(120) NOT NULL,
            "description" TEXT NOT NULL,
            "category" VARCHAR(80) NOT NULL,
            "price" NUMERIC(10, 2) NOT NULL,
            "image_url" TEXT NOT NULL,
            "stock" INTEGER NOT NULL DEFAULT 0,
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "CartItems" (
            "id" SERIAL PRIMARY KEY,
            "user_id" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
            "product_id" INTEGER NOT NULL REFERENCES "Products"("id") ON DELETE CASCADE,
            "quantity" INTEGER NOT NULL CHECK ("quantity" >= 1),
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE ("user_id", "product_id")
        );

        CREATE TABLE IF NOT EXISTS "Orders" (
            "id" SERIAL PRIMARY KEY,
            "user_id" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
            "first_name" VARCHAR(80) NOT NULL,
            "last_name" VARCHAR(80) NOT NULL,
            "postal_code" VARCHAR(20) NOT NULL,
            "total_amount" NUMERIC(10, 2) NOT NULL,
            "status" VARCHAR(40) NOT NULL DEFAULT 'confirmed',
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS "OrderItems" (
            "id" SERIAL PRIMARY KEY,
            "order_id" INTEGER NOT NULL REFERENCES "Orders"("id") ON DELETE CASCADE,
            "product_id" INTEGER NOT NULL REFERENCES "Products"("id") ON DELETE RESTRICT,
            "quantity" INTEGER NOT NULL CHECK ("quantity" >= 1),
            "price_at_purchase" NUMERIC(10, 2) NOT NULL
        );
    `);
}

createSchema()
    .then(() => {
        console.log('Database schema created successfully.');
    })
    .catch((error) => {
        console.error('Error creating schema:', error);
        process.exitCode = 1;
    })
    .finally(() => {
        pool.end();
    });
