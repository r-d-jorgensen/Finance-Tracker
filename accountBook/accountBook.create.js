import { object, string } from 'yup';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default createAccountBook;

let accountBook = object({
    
});

async function createAccountBook(newAccountBook) {
    newAccountBook = await recordSchema.validate(newAccountBook);

    const sql = `INSERT INTO record () VALUES ()`;
    const accountBook = (await connectionPool.execute(sql, []))[0];
    if (!accountBook) throw new APIError('Database connection Error', 500, 'Unable to get response from Database');

    return {
        accountBook_id: accountBook.insertId,
    };
}