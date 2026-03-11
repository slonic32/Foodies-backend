import HttpError from '../helpers/HttpError.js';

import { getUserById } from './authServices.js';

export async function changeAvatar(id, avatar) {
    try {
        const user = await getUserById(id);
        await user.update({ avatar: avatar });
        return user;
    } catch (error) {
        throw HttpError(500);
    }
}
