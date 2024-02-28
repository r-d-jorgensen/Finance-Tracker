import jwt from 'jsonwebtoken';
import { userSchema } from './user.dataSchemas.js';
import connectionPool from '../_utilities/connection.js';

export default authenticateUser;

async function authenticateUser(userAuth) {
    userAuth = await userSchema.validate(userAuth);

    // User is undefined if no matches in DB
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    const user = (await connectionPool.execute(sql, [userAuth.username, userAuth.password]))[0][0];
    if (!user) throw 'Username or password is incorrect';

    // return user data with a jwt token that is valid for 7 days
    return {
        user_id: user.user_id,
        username: user.username,
        token: jwt.sign({ sub: 0 }, process.env.TOKEN_SECRET, { expiresIn: '7d' })
    };
}