const pool = require('../../../../config/database');

const getLastCustomerWalletId = async () => {
    const result = await pool.query('SELECT id FROM customerWallets ORDER BY id DESC LIMIT 1');
    return result.rows.length > 0 ? parseInt(result.rows[0].id) : 0;
};

const insertCustomerWallet = async ({ id, name, birthDate, cellphone, phone, email, occupation, state }) => {
    const query = `
        INSERT INTO customerWallets (id, name, birth_date, cellphone, phone, email, occupation, state)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [id, name, birthDate, cellphone, phone, email, occupation, state];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getCustomerWallets = async (typeUser, limit, offset) => {
    const query =
        typeUser === 'admin'
            ? 'SELECT * FROM customerWallets LIMIT $1 OFFSET $2'
            : 'SELECT id, name, occupation FROM customerWallets LIMIT $1 OFFSET $2';

    const result = await pool.query(query, [limit, offset]);
    return result.rows;
};

const searchCustomerWalletsById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM customerWallets WHERE id = $1', 
        [id]
    );
    return result.rows;
};

module.exports = {
    getLastCustomerWalletId,
    insertCustomerWallet,
    getCustomerWallets,
    searchCustomerWalletsById
};
