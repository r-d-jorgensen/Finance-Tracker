import express from 'express';
import authenticateUser from './user.authenticateUser.js';
const router = express.Router();

// routes
router.post('/authenticate', authenticate);

export default router;

function authenticate(req, res, next) {
    authenticateUser(req.body)
        .then(user => res.json(user))
        .catch(next);
}