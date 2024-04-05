import express from 'express';
import createUser from './user.create.js';
import deleteUser from './user.delete.js';
import loginUser from './user.login.js';
import updateUser from './user.update.js';
const router = express.Router();

// User routes
router.post('/createUser', createUserControler);
router.post('/deleteUser', deleteUserControler);
router.post('/loginUser', loginUserControler);
router.post('/updateUser', updateUserControler);

function createUserControler(req, res, next) {
    createUser(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function deleteUserControler(req, res, next) {
    deleteUser(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function loginUserControler(req, res, next) {
    loginUser(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function updateUserControler(req, res, next) {
    updateUser(req.body)
        .then(user => res.json(user))
        .catch(next);
}

export default router;