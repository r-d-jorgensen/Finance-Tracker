import jwt from 'jsonwebtoken';
import { object, string } from 'yup';
import connection from '../_utilities/connection.js';

export default {
    authenticateUser
};

// TODO: currently only alphaNum.. should allow special chars for password security
let userSchema = object({
    username: string().matches('^[a-zA-Z0-9]').min(5).required(),
    password: string().matches('^[a-zA-Z0-9]').min(3).required()
});

async function authenticateUser(userAuth) {
    const user = await userSchema.validate(userAuth);
    const sql = `SELECT * FROM users WHERE username = '${user.username}' AND password = '${user.password}'`;
    const [rows] = await connection.promise().query(sql);

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