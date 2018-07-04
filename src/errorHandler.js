const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (error instanceof SyntaxError || error instanceof TypeError) {
        res.status(400).send('Invalid request - JSON expected.');
    } else if (error) {
        res.status(400).send(error.message);
    } else {
        next();
    }
};

module.exports.errorHandler = errorHandler;