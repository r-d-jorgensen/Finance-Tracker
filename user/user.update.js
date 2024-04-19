import { object, string, number } from 'yup';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default updateUser;

let userSchema = object({
    userid: number().required(),
    username: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
    password: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(3).required(),
    email: string().email().required()
});

async function updateUser(user) {
    user = await userSchema.validate(user);
    
    const sqlquery = `UPDATE users SET password = ?, email = ? WHERE user_id = ? AND username = ?`;
    const dbResponse = (await connectionPool.execute(sqlquery, [user.password, user.email, user.userid, user.username]))[0];
    if (dbResponse.affectedRows === 0) throw new APIError('Bad Data', 400, 'Data same as Database');

    return {
        message: "Password and Email Updated Successfully"
    };
}