import jwt from 'jsonwebtoken';
import { object, string } from 'yup';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default createUserControler;

function createUserControler(req, res, next) {
    createUser(req.body)
        .then(user => res.json(user))
        .catch(next);
}

let userSchema = object({
    username: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
    password: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(3).required(),
    email: string().email().required()
});

async function createUser(newUser) {
    newUser = await userSchema.validate(newUser);

    const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    const user = (await connectionPool.execute(sql, [newUser.username, newUser.password, newUser.email]))[0];
    if (!user) throw new APIError('Database connection Error', 500, 'Unable to get response from Database');

    // return user data with a jwt token that is valid for 7 days
    return {
        user_id: user.insertId,
        username: newUser.username,
        token: jwt.sign({ sub: 0 }, process.env.TOKEN_SECRET, { expiresIn: '7d' })
    };
}