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

const searchAccountByParentId = async (id) => {
    const result = await pool.query(
        'SELECT * FROM bankaccounts WHERE numero_conta = $1',
        [id]
    );
    return result.rows;
};

const insertTransactions = async ({ parent_id, total, tipo_transacao }) => {
    const query = `
        INSERT INTO transactions ( parent_id, total, data_transacao, tipo_transacao )
        VALUES ($1, $2, now(), $3)
        RETURNING *;
    `;
    const values = [parent_id, total, tipo_transacao];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateAccountById = async ({ typeTransaction, newValue, parent_id }) => {
    const query = `UPDATE bankaccounts SET ${typeTransaction} = $1 WHERE numero_conta = $2`;
    
    const result = await pool.query(query, [newValue, parent_id]);
    return result.rows; 
};


module.exports = {
    getUserTransactions,
    getAdminTransactions,
    searchTransactionsByParentId,
    searchAccountByParentId,
    insertTransactions,
    updateAccountById
};
