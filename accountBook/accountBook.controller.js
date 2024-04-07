import express from 'express';
import createAccountBook from './accountBook.create.js';
import deleteAccountBook from './accountBook.delete.js';
import getAccountBook from './accountBook.get.js';
import updateAccountBook from './accountBook.update.js';
const router = express.Router();

// Record routes
router.post('/createAccountBook', createAccountBookControler);
router.post('/deleteAccountBook', deleteAccountBookControler);
router.post('/getAccountBook', getAccountBookControler);
router.post('/updateAccountBook', updateAccountBookControler);

function createAccountBookControler(req, res, next) {
    createAccountBook(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function deleteAccountBookControler(req, res, next) {
    deleteAccountBook(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function getAccountBookControler(req, res, next) {
    getAccountBook(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function updateAccountBookControler(req, res, next) {
    updateAccountBook(req.body)
        .then(user => res.json(user))
        .catch(next);
}

export default router;