const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const { signToken } = require('../helpers/jwt');

class AuthController {
    static async register(req, res) {
        const { email, username, password } = req.body;

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            username,
            password_hash,
        });

        const token = signToken(user);

        return res.status(201).json({
            accessToken: token,
            tokenType: 'Bearer',
        });
    }

    static async login(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user);

        return res.json({
            accessToken: token,
            tokenType: 'Bearer',
        });
    }
}

module.exports = AuthController;
