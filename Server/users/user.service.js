const jwt = require('jsonwebtoken');
const connection = require('../_utilities/connection');

module.exports = {
    authenticate
};

async function authenticate({ username, password }) {
    // TODO: check for bad characters and injection 
    const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const [rows] = await connection.promise().query(sql);

    // TODO Needs better error checking
    if (rows.length === 0) throw 'Username or password is incorrect';

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: 0 }, process.env.TOKEN_SECRET, { expiresIn: '7d' });
    return {
        ...omitPassword(rows[0]),
        token
    };
}

// helper functions
function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}