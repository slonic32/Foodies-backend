import { changeAvatar } from '../services/usersServices.js';

import { resizeImg } from '../services/imgServices.js';

import { getUserById } from '../services/authServices.js';

export async function updateAvatar(req, res, next) {
    try {
        if (req.file) {
            const avatar = await resizeImg(req.file);
            const user = await changeAvatar(req.user.id, avatar);
            return res.status(200).json({
                avatar: user.avatar,
            });
        }
        return res.status(401).json({
            message: 'Not authorized',
        });
    } catch (error) {
        next(error);
    }
}

export async function currentUser(req, res, next) {
    try {
        const user = await getUserById(req.user.id);
        res.status(200).json({
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        });
    } catch (error) {
        next(error);
    }
}
