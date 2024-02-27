export default errorHandler;

// TODO - Needs better error checking and more effective error messages not just all 500
function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        return res.status(400).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    return res.status(500).json({ message: err.message });
}