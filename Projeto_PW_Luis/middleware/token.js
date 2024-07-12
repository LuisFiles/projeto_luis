const Users = require('../data/user/indexAuth');

module.exports = (req, res, next) => {
    console.log('Cookies:', req.cookies); // Log to check if cookies are being parsed
    let token = req.cookies?.token;

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided. token.js' });
    }

    Users.verificaToken(token)
    .then((decoded) => {
        req.roleUser = decoded.role;
        next();
    })
    .catch((err) => {
        console.log(err);
        res.status(401).send({ auth: false, message: 'Not authorized' });
    });
};
