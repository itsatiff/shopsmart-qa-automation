const pool = require('../models/db');

const products = [
    ['Wireless Headphones', 'Noise-isolating headphones with clear sound and all-day comfort.', 'Audio', 129.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 24],
    ['Mechanical Keyboard', 'Tactile switches, white backlighting, and a sturdy aluminum frame.', 'Workspace', 99.99, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80', 18],
    ['Gaming Mouse', 'Lightweight mouse with precision tracking and programmable buttons.', 'Gaming', 59.99, 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80', 32],
    ['4K Monitor', 'Crisp 27-inch display with rich color for work, streaming, and design.', 'Displays', 349.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80', 12],
    ['Laptop Stand', 'Ergonomic aluminum stand that improves posture and desk airflow.', 'Workspace', 44.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80', 40],
    ['HD Webcam', 'Sharp 1080p camera with autofocus for calls, classes, and streaming.', 'Video', 74.99, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80', 20],
    ['Smart Watch', 'Fitness tracking, notifications, and a bright always-on display.', 'Wearables', 189.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 16],
    ['Bluetooth Speaker', 'Portable speaker with warm sound and water-resistant design.', 'Audio', 84.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80', 28],
];

async function seedDatabase() {
    await pool.query('DELETE FROM "OrderItems"');
    await pool.query('DELETE FROM "Orders"');
    await pool.query('DELETE FROM "CartItems"');
    await pool.query('DELETE FROM "Products"');
    await pool.query('DELETE FROM "Users"');
    await pool.query('ALTER SEQUENCE "Users_id_seq" RESTART WITH 1');
    await pool.query('ALTER SEQUENCE "Products_id_seq" RESTART WITH 1');
    await pool.query('ALTER SEQUENCE "CartItems_id_seq" RESTART WITH 1');
    await pool.query('ALTER SEQUENCE "Orders_id_seq" RESTART WITH 1');
    await pool.query('ALTER SEQUENCE "OrderItems_id_seq" RESTART WITH 1');

    await pool.query(
        `INSERT INTO "Users" ("username", "password", "full_name", "email")
         VALUES ($1, $2, $3, $4)`,
        ['standard_user', 'secret_sauce', 'Standard User', 'standard@shopsmart.com'],
    );

    for (const product of products) {
        await pool.query(
            `INSERT INTO "Products" ("name", "description", "category", "price", "image_url", "stock")
             VALUES ($1, $2, $3, $4, $5, $6)`,
            product,
        );
    }
}

seedDatabase()
    .then(() => {
        console.log('Database seeded successfully.');
    })
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exitCode = 1;
    })
    .finally(() => {
        pool.end();
    });
