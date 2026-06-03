const pool = require('./db');

module.exports.getAllProducts = async function getAllProducts() {
    const { rows } = await pool.query(
        `SELECT *
         FROM "Products"
         ORDER BY "id" ASC`,
    );

    return rows;
};

module.exports.getProductById = async function getProductById(id) {
    const { rows } = await pool.query(
        `SELECT *
         FROM "Products"
         WHERE "id" = $1`,
        [id],
    );

    return rows[0];
};
