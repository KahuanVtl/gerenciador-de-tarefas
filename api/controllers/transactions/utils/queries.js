const pool = require('../../../../config/database');

const getUserTransactions = async (limit, offset) => {
    const result = await pool.query(
        'SELECT id, name, occupation FROM transactions LIMIT $1 OFFSET $2', 
        [limit, offset]
    );
    return result.rows;
};

const getAdminTransactions = async (limit, offset) => {
    const result = await pool.query(
        'SELECT * FROM transactions LIMIT $1 OFFSET $2', 
        [limit, offset]
    );
    return result.rows;
};

const searchTransactionsByParentId = async (id) => {
    const result = await pool.query(
        'SELECT * FROM transactions WHERE parent_id = $1',
        [id]
    );
    return result.rows;
};

module.exports = {
    getUserTransactions,
    getAdminTransactions,
    searchTransactionsByParentId
};
