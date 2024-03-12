import express from 'express';
import createUserControler from './user.create.js';
import deleteUserControler from './user.delete.js';
import loginUserControler from './user.login.js';
const router = express.Router();

// User routes
router.post('/createUser', createUserControler);
router.post('/deleteUser', deleteUserControler);
router.post('/loginUser', loginUserControler);

export default router;