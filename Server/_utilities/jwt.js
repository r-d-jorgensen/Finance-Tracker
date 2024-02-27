import { expressjwt } from 'express-jwt';

export default jwt;

function jwt() {
    const secret = process.env.TOKEN_SECRET;
    return expressjwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/users/authenticate'
        ]
    });
}