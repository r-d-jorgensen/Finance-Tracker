import { object, string, number } from 'yup';
import { compare } from 'bcrypt';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default deleteUser;

let userSchema = object({
    user_id: number().positive().min(1).required(),
    username: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
    password: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
});

async function deleteUser(user) {
    user = await userSchema.validate(user);

    // TODO - This needs to cascade across all data that has user ID and use a trasaction
    // Double check auth and password before deleting
    const sqlUserquery = `SELECT * FROM users WHERE user_id = ? AND username = ?`;
    let dbResponse = (await connectionPool.execute(sqlUserquery, [user.user_id, user.username]))[0][0];
    if (!dbResponse) throw new APIError('Database connection Error', 500, 'Unable to get response from Database');
    if (!(await compare(user.password, dbResponse.password))) throw new APIError('Bad Auth', 401, 'Password is incorrect');

    const sqlDeletequery = `DELETE FROM users WHERE user_id = ? AND username = ?`;
    dbResponse = (await connectionPool.execute(sqlDeletequery, [user.user_id, user.username]));
    if (dbResponse.affectedRows == 0) throw new APIError('Reject Data', 400, 'Failed to find user');

    return {
        message: "User was deleted successfully"
    };
}