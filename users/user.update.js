import { object, string, number } from 'yup';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default updateUserControler;

function updateUserControler(req, res, next) {
    updateUser(req.body)
        .then(user => res.json(user))
        .catch(next);
}

let userSchema = object({
    userid: number().required(),
    username: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
    password: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(3).required(),
    email: string().email().required()
});

async function updateUser(user) {
    user = await userSchema.validate(user);

    const sql = `UPDATE users SET password = ?, email = ? WHERE user_id = ? AND username = ?`;
    const dbResponse = (await connectionPool.execute(sql, [user.password, user.email, user.userid, user.username]))[0];
    if (dbResponse.affectedRows === 0) throw new APIError('Database connection Error', 500, 'Unable to get response from Database');

    return {
        message: "Password and Email Updated Successfully"
    };
}