import { User } from '../db/models/usersModel.js';
import HttpError from '../helpers/HttpError.js';

import { genToken } from './jwtServices.js';
import gravatar from 'gravatar';

export async function getUserByEmail(userEmail) {
    try {
        const user = await User.findOne({
            where: {
                email: userEmail,
            },
        });
        return user;
    } catch (error) {
        throw HttpError(500);
    }
}

export async function createUser(userName, userEmail, userPassword) {
    try {
        const avatar = gravatar.url(userEmail, { s: '250' }, false);

        const newUser = await User.create({
            name: userName,
            email: userEmail,
            password: userPassword,
            avatar: avatar,
        });
        return newUser;
    } catch (error) {
        throw HttpError(500);
    }
}

export async function loginUserService({ email, password }) {
    const user = await getUserByEmail(email);

    if (!user) throw HttpError(401, 'Email or password invalid');

    const passwordCompare = await user.checkPassword(password, user.password);
    if (!passwordCompare) throw HttpError(401, 'Email or password invalid');

    const token = genToken(user.id);

    await user.update({ token });

    return user;
}

export async function logoutUserService(id) {
    try {
        const user = await User.findByPk(id);
        if (!user) throw HttpError(401, 'Not authorized');

        await user.update({ token: null });
        return;
    } catch (error) {
        throw HttpError(500);
    }
}
