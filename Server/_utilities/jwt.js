const { expressjwt } = require('express-jwt');

module.exports = jwt;

function jwt() {
    const secret = process.env.TOKEN_SECRET;
    return expressjwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/users/authenticate'
        ]
    });
}