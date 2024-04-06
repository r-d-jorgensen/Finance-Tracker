import express from 'express';
import createAccountBook from './accountBook.create.js';
import getAccountBook from './accountBook.get.js';
const router = express.Router();

// Record routes
router.post('/createAccountBook', createAccountBookControler);
router.post('/getAccountBook', getAccountBookControler);

function createAccountBookControler(req, res, next) {
    createAccountBook(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function getAccountBookControler(req, res, next) {
    getAccountBook(req.body)
        .then(user => res.json(user))
        .catch(next);
}

export default router;