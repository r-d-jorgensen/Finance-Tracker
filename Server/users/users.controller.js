import express from 'express';
import userService from './user.service.js';
const router = express.Router();

// routes
router.post('/authenticate', authenticate);

export default router;

function authenticate(req, res, next) {
    userService.authenticateUser(req.body)
        .then(user => res.json(user))
        .catch(next);
}