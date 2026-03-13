import {
    changeAvatar, addFollower,
    removeFollower,
    getUserFollowers,
    getUserFollowing
} from '../services/usersServices.js';

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


export async function followUser(req, res, next) {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        await addFollower(currentUserId, targetUserId);
        res.status(200).json({ message: 'Successfully followed user' });
    } catch (error) {
        next(error);
    }
}

export async function unfollowUser(req, res, next) {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You can't unfollow yourself" });
        }

        await removeFollower(currentUserId, targetUserId);
        res.status(200).json({ message: 'Successfully unfollowed user' });
    } catch (error) {
        next(error);
    }
}

export async function getFollowers(req, res, next) {
    try {
        const followers = await getUserFollowers(req.user.id);
        res.status(200).json(followers);
    } catch (error) {
        next(error);
    }
}

export async function getFollowing(req, res, next) {
    try {
        const following = await getUserFollowing(req.user.id);
        res.status(200).json(following);
    } catch (error) {
        next(error);
    }
}
