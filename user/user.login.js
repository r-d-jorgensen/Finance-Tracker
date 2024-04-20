import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { object, string } from 'yup';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default loginUser;

let userSchema = object({
    username: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
    password: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required()
});

async function loginUser(userAuth) {
    userAuth = await userSchema.validate(userAuth);

    // All usernames should be unique so only the first value matters
    const sqlquery = `SELECT * FROM users WHERE username = ?`;
    const user = (await connectionPool.execute(sqlquery, [userAuth.username]))[0][0];
    if (!user) throw new APIError('Database connection Error', 500, 'Unable to get response from Database');

    // TODO - password should be sent in encrypted from server side then decrypted here for comparison
    if (!(await compare(userAuth.password, user.password))) throw new APIError('Bad Auth', 401, 'Username or password is incorrect');

    // return user data with a jwt token that is valid for 7 days
    return {
        user_id: user.user_id,
        username: user.username,
        token: jwt.sign({ sub: 0 }, process.env.TOKEN_SECRET, { expiresIn: '7d' })
    };
}