import HttpError from '../helpers/HttpError.js';
import { User } from '../db/models/usersModel.js';
import { Subscription } from '../db/models/subscriptionsModel.js';

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

export async function addFollower(followerId, followingId) {
    try {

        const targetUser = await User.findByPk(followingId);
        if (!targetUser) {
            throw HttpError(404, "User you are trying to follow not found");
        }

        const existingSubscription = await Subscription.findOne({
            where: {
                follower_id: followerId,
                following_id: followingId,
            }
        });

        if (existingSubscription) {
            throw HttpError(409, "You are already following this user");
        }

        await Subscription.create({
            follower_id: followerId,
            following_id: followingId,
        });

        return true;
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, "Error following user");
    }
}

export async function removeFollower(followerId, followingId) {
    try {
        const deletedCount = await Subscription.destroy({
            where: {
                follower_id: followerId,
                following_id: followingId,
            }
        });

        if (deletedCount === 0) {
            throw HttpError(400, "You are not following this user");
        }

        return true;
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, "Error unfollowing user");
    }
}


export async function getUserFollowers(userId) {
    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: User,
                as: 'followers',
                attributes: ['id', 'name', 'avatar', 'email'],
                through: { attributes: [] }
            }]
        });

        if (!user) throw HttpError(404, "User not found");

        return user.followers;
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, "Error fetching followers");
    }
}

export async function getUserFollowing(userId) {
    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: User,
                as: 'followings',
                attributes: ['id', 'name', 'avatar', 'email'],
                through: { attributes: [] }
            }]
        });

        if (!user) throw HttpError(404, "User not found");

        return user.followings;
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, "Error fetching following list");
    }
}
