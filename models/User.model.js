const pool = require('./db');

module.exports.findUserByCredentials = async function findUserByCredentials(username, password) {
    const { rows } = await pool.query(
        `SELECT "id", "username", "full_name", "email", "created_at"
         FROM "Users"
         WHERE "username" = $1 AND "password" = $2`,
        [username, password],
    );

    return rows[0];
};

module.exports.getUserById = async function getUserById(id) {
    const { rows } = await pool.query(
        `SELECT "id", "username", "full_name", "email", "created_at"
         FROM "Users"
         WHERE "id" = $1`,
        [id],
    );

    return rows[0];
};
