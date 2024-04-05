import { object, string } from 'yup';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default createRecord;

let recordSchema = object({
    
});

async function createRecord(newRecord) {
    newRecord = await recordSchema.validate(newRecord);

    const sql = `INSERT INTO record () VALUES ()`;
    const record = (await connectionPool.execute(sql, []))[0];
    if (!record) throw new APIError('Database connection Error', 500, 'Unable to get response from Database');

    return {
        record_id: record.insertId,
    };
}