const jwt = require('jsonwebtoken');

// usage
// app.get('/api/profile', authMiddleware, (req, res) => {
//   res.json({ user: req.user });
// });
module.exports = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { userId, email }
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
