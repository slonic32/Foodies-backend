import { validateID } from '../helpers/validate.js';
import { readToken } from '../services/jwtServices.js';
import { getUserById } from '../services/usersServices.js';

export async function auth(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: 'Not authorized',
            });
        }
        if (!req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Not authorized',
            });
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Not authorized asdas das',
            });
        }
        const id = readToken(token);
        if (!validateID(id)) {
            return res.status(401).json({
                message: 'Not authorized',
            });
        }

        const user = await getUserById(id);
        if (user && user.token === token) {
            req.user = user;
            next();
        } else {
            return res.status(401).json({
                message: 'Not authorized',
            });
        }
    } catch (error) {
        next(error);
    }
}
