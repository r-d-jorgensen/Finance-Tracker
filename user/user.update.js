import { object, string, number } from 'yup';
import { compare, hash } from 'bcrypt';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default updateUser;

let userSchema = object({
    user_id: number().min(1).required(),
    username: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
    password: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
    email: string().email().required()
});

async function updateUser(user) {
    user = await userSchema.validate(user);

    let sqlquery = `SELECT * FROM users WHERE user_id = ? AND username = ?`;
    let dbResponse = (await connectionPool.execute(sqlquery, [user.user_id, user.username]))[0][0];
    if (!await compare(user.password, dbResponse.password)) {
        sqlquery = `UPDATE users SET password = ? WHERE user_id = ? AND username = ?`;
        const hashedPassword = await hash(user.password, Number(process.env.SALT_ROUNDS));
        dbResponse = (await connectionPool.execute(sqlquery, [hashedPassword, user.user_id, user.username]))[0];
        return {
            message: "Password Updated Successfully"
        };
    }
    if (dbResponse.email == user.email)throw new APIError('Bad Data', 400, 'Data same as Database')

    
    sqlquery = `UPDATE users SET email = ? WHERE user_id = ? AND username = ?`;
    dbResponse = (await connectionPool.execute(sqlquery, [user.email, user.user_id, user.username]))[0];
    return {
        message: "Email Updated Successfully"
    }  
}