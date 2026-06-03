const pool = require('./db');

module.exports.getCartByUserId = async function getCartByUserId(userId) {
    const { rows } = await pool.query(
        `SELECT
            ci."id",
            ci."user_id",
            ci."product_id",
            ci."quantity",
            ci."created_at",
            p."name",
            p."description",
            p."category",
            p."price",
            p."image_url",
            p."stock",
            (ci."quantity" * p."price")::numeric(10, 2) AS "line_total"
         FROM "CartItems" ci
         JOIN "Products" p ON p."id" = ci."product_id"
         WHERE ci."user_id" = $1
         ORDER BY ci."id" ASC`,
        [userId],
    );

    return rows;
};

module.exports.addCartItem = async function addCartItem(cartItem) {
    const { user_id, product_id, quantity } = cartItem;

    const { rows } = await pool.query(
        `INSERT INTO "CartItems" ("user_id", "product_id", "quantity")
         VALUES ($1, $2, $3)
         ON CONFLICT ("user_id", "product_id")
         DO UPDATE SET "quantity" = "CartItems"."quantity" + EXCLUDED."quantity"
         RETURNING *`,
        [user_id, product_id, quantity],
    );

    return rows[0];
};

module.exports.updateCartItem = async function updateCartItem(id, quantity) {
    const { rows } = await pool.query(
        `UPDATE "CartItems"
         SET "quantity" = $1
         WHERE "id" = $2
         RETURNING *`,
        [quantity, id],
    );

    return rows[0];
};

module.exports.deleteCartItem = async function deleteCartItem(id) {
    const { rows } = await pool.query(
        `DELETE FROM "CartItems"
         WHERE "id" = $1
         RETURNING *`,
        [id],
    );

    return rows[0];
};

module.exports.clearCartByUserId = async function clearCartByUserId(userId) {
    const { rows } = await pool.query(
        `DELETE FROM "CartItems"
         WHERE "user_id" = $1
         RETURNING *`,
        [userId],
    );

    return rows;
};
