import {
    changeAvatar, addFollower,
    removeFollower,
    getUserFollowers,
    getUserFollowing,
    fetchCurrentUserInfo,
    fetchUserInfo
} from '../services/usersServices.js';

import { resizeImg } from '../services/imgServices.js';



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

export async function getCurrentUserInfo(req, res, next) {
    try {
        const userInfo = await fetchCurrentUserInfo(req.user.id);

        res.status(200).json(userInfo);
    } catch (error) {
        next(error);
    }
}

export async function getUserInfo(req, res, next) {
    try {
        const userInfo = await fetchUserInfo(req.params.id);

        res.status(200).json(userInfo);
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


