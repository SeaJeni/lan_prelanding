const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

exports.signToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

exports.verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
