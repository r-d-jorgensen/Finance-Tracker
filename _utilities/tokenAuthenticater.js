import { expressjwt } from 'express-jwt';

export default tokenAuthenicator;

function tokenAuthenicator() {
    const secret = process.env.TOKEN_SECRET;
    return expressjwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/users/loginUser',
            '/users/createUser'
        ]
    });
}