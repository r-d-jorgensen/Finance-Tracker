import express from 'express';
import createRecord from './record.create.js';
const router = express.Router();

// Record routes
router.post('/createRecord', createRecordControler);

function createRecordControler(req, res, next) {
    createRecord(req.body)
        .then(user => res.json(user))
        .catch(next);
}

export default router;