export default errorHandler;

function errorHandler(err, req, res, next) {
    if (err.status >= 500) {
        console.log(err)
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            name: err.name,
            message: 'Data did not match allowed structure',
            inValidEntries: err.errors
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    return res.status(err.status ? err.status : 500).json({ 
        name: err.name,
        message: err.message 
    });
}