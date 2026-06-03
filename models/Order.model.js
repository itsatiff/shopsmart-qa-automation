const pool = require('./db');

module.exports.createOrderFromCart = async function createOrderFromCart(orderDetails) {
    const { user_id, first_name, last_name, postal_code } = orderDetails;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const cartResult = await client.query(
            `SELECT
                ci."product_id",
                ci."quantity",
                p."price",
                p."name"
             FROM "CartItems" ci
             JOIN "Products" p ON p."id" = ci."product_id"
             WHERE ci."user_id" = $1
             ORDER BY ci."id" ASC`,
            [user_id],
        );

        if (cartResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const totalAmount = cartResult.rows.reduce((total, item) => {
            return total + Number(item.price) * Number(item.quantity);
        }, 0);

        const orderResult = await client.query(
            `INSERT INTO "Orders"
                ("user_id", "first_name", "last_name", "postal_code", "total_amount", "status")
             VALUES ($1, $2, $3, $4, $5, 'confirmed')
             RETURNING *`,
            [user_id, first_name, last_name, postal_code, totalAmount.toFixed(2)],
        );

        const order = orderResult.rows[0];

        for (const item of cartResult.rows) {
            await client.query(
                `INSERT INTO "OrderItems"
                    ("order_id", "product_id", "quantity", "price_at_purchase")
                 VALUES ($1, $2, $3, $4)`,
                [order.id, item.product_id, item.quantity, item.price],
            );
        }

        await client.query(
            `DELETE FROM "CartItems"
             WHERE "user_id" = $1`,
            [user_id],
        );

        await client.query('COMMIT');

        return {
            ...order,
            items: cartResult.rows,
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports.getOrdersByUserId = async function getOrdersByUserId(userId) {
    const { rows } = await pool.query(
        `SELECT
            o."id",
            o."user_id",
            o."first_name",
            o."last_name",
            o."postal_code",
            o."total_amount",
            o."status",
            o."created_at",
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', oi."id",
                        'product_id', oi."product_id",
                        'quantity', oi."quantity",
                        'price_at_purchase', oi."price_at_purchase",
                        'name', p."name"
                    )
                ) FILTER (WHERE oi."id" IS NOT NULL),
                '[]'
            ) AS "items"
         FROM "Orders" o
         LEFT JOIN "OrderItems" oi ON oi."order_id" = o."id"
         LEFT JOIN "Products" p ON p."id" = oi."product_id"
         WHERE o."user_id" = $1
         GROUP BY o."id"
         ORDER BY o."created_at" DESC`,
        [userId],
    );

    return rows;
};
