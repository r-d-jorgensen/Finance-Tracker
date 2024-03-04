import { object, string } from 'yup';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default createUser;

let userSchema = object({
    username: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
    password: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(3).required(),
    email: string().email().required()
});

async function createUser(newUser) {
    newUser = await userSchema.validate(newUser);

    const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    const user = (await connectionPool.execute(sql, [newUser.username, newUser.password, newUser.email]))[0][0];
    if (!user) throw new APIError('Reject Data', 400, 'Username is taken');

    // return user data with a jwt token that is valid for 7 days
    return {
        user_id: user.user_id,
        username: user.username,
        token: jwt.sign({ sub: 0 }, process.env.TOKEN_SECRET, { expiresIn: '7d' })
    };
}