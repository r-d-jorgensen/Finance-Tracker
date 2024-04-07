import { object, string } from 'yup';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default deleteAccountBook;

let accountBook = object({
    
});

async function deleteAccountBook(userId) {
    userId = await recordSchema.validate(userId);

    const sql = `INSERT INTO record () VALUES ()`;
    const accountBook = (await connectionPool.execute(sql, []))[0];
    if (!accountBook) throw new APIError('Database connection Error', 500, 'Unable to get response from Database');

    return {
        ...accountBook
    };
}