const pool = require('../../config/database');

const getUserKey = async (Authorization) => {
    const result = await pool.query(
        'SELECT id, typeUser FROM securityKeys WHERE id = $1', 
        [Authorization]
    );
    return result.rows[0];
};

module.exports = {
    getUserKey
};
