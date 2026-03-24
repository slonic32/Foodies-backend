import { createUser, getUserByEmail, loginUserService, logoutUserService } from '../services/authServices.js';

export async function registerUser(req, res, next) {
    try {
        const { name, email, password } = req.body;
        if (await getUserByEmail(email)) {
            return res.status(409).json({
                message: 'Email in use',
            });
        }
        const newUser = await createUser(name, email, password);

        return res.status(201).json({
            token: newUser.token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await loginUserService({ email, password });
        res.status(200).json({
            token: user.token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function logoutUser(req, res, next) {
    try {
        const userId = req.user.id;
        await logoutUserService(userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
