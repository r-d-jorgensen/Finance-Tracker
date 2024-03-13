import express from 'express';
import createUserControler from './user.create.js';
import deleteUserControler from './user.delete.js';
import loginUserControler from './user.login.js';
import updateUserControler from './user.update.js';
const router = express.Router();

// User routes
router.post('/createUser', createUserControler);
router.post('/deleteUser', deleteUserControler);
router.post('/loginUser', loginUserControler);
router.post('/updateUser', updateUserControler);

export default router;