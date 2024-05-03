import { object, string, number } from 'yup';
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
    const sqlquery = `DELETE FROM users WHERE user_id = ? AND username = ?`;
    const dbResponse = (await connectionPool.execute(sqlquery, [user.user_id, user.username, user.password]));
    if (dbResponse.affectedRows == 0) throw new APIError('Reject Data', 400, 'Failed to find user');

    return {
        message: "User was deleted successfully"
    };
}