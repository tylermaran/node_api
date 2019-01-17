const jwt = require('jsonwebtoken')

// start with the default express middleware setup
module.exports = (req, res, next) => {
    // using a try block here. It will flip to the catch as soon as it hits an error
    try {
        // we assume a token will be passed through the authorization header
        // Should be 'Bearer <token>, and we just want to token part'
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // adding a new field to our req
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth Failed'
        });
    }
};
