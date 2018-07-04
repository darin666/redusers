const errorHandler = (error, req, res, next) => {
    if (error instanceof SyntaxError) {
        res.status(400).send('Invalid request - JSON expected.');
    } else if (error) {
        res.status(400).send(error);
    } else {
        next();
    }
};

module.exports.errorHandler = errorHandler;