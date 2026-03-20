import HttpError from '../helpers/HttpError.js';
import { User } from '../db/models/usersModel.js';
import { Subscription } from '../db/models/subscriptionsModel.js';
import { Recipe } from '../db/models/recipesModel.js';
import { Favorite } from '../db/models/favoritesModel.js';

export async function changeAvatar(id, avatar) {
    try {
        const user = await User.findByPk(id);
        if (!user) throw HttpError(404, 'User not found');

        await user.update({ avatar: avatar });
        return user;
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, 'Error updating avatar');
    }
}

export async function getUserById(id) {
    try {
        const user = await User.findByPk(id);
        return user;
    } catch (error) {
        console.error('Database error in getUserById:', error);
        throw HttpError(500);
    }
}

export async function fetchUserInfo(userId) {
    try {
        const user = await getUserWithBasicInfo(userId);

        const [recipesCount, followersCount] = await Promise.all([
            Recipe.count({ where: { owner_id: userId } }),
            Subscription.count({ where: { following_id: userId } }),
        ]);

        return {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            recipesCount,
            followersCount,
        };
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, "error fetching user's info");
    }
}

export async function fetchCurrentUserInfo(userId) {
    try {
        const user = await getUserWithBasicInfo(userId);

        const [recipesCount, favoritesCount, followersCount, followingCount] = await Promise.all([
            Recipe.count({ where: { owner_id: userId } }),
            Favorite.count({ where: { user_id: userId } }),
            Subscription.count({ where: { following_id: userId } }),
            Subscription.count({ where: { follower_id: userId } }),
        ]);

        return {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            recipesCount,
            favoritesCount,
            followersCount,
            followingCount,
        };
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, 'Error fetching current user');
    }
}

async function getUserWithBasicInfo(userId) {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'avatar'],
    });

    if (!user) {
        throw HttpError(404, 'User not found');
    }
    return user;
}

export async function addFollower(followerId, followingId) {
    try {
        const targetUser = await User.findByPk(followingId);
        if (!targetUser) {
            throw HttpError(404, 'User you are trying to follow not found');
        }

        const existingSubscription = await Subscription.findOne({
            where: {
                follower_id: followerId,
                following_id: followingId,
            },
        });

        if (existingSubscription) {
            throw HttpError(409, 'You are already following this user');
        }

        await Subscription.create({
            follower_id: followerId,
            following_id: followingId,
        });

        return true;
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, 'Error following user');
    }
}

export async function removeFollower(followerId, followingId) {
    try {
        const deletedCount = await Subscription.destroy({
            where: {
                follower_id: followerId,
                following_id: followingId,
            },
        });

        if (deletedCount === 0) {
            throw HttpError(400, 'You are not following this user');
        }

        return true;
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, 'Error unfollowing user');
    }
}

export async function getUserFollowers(userId) {
    try {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: User,
                    as: 'followers',
                    attributes: ['id', 'name', 'avatar', 'email'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!user) throw HttpError(404, 'User not found');

        return user.followers;
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, 'Error fetching followers');
    }
}

export async function getUserFollowing(userId) {
    try {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: User,
                    as: 'followings',
                    attributes: ['id', 'name', 'avatar', 'email'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!user) throw HttpError(404, 'User not found');

        return user.followings;
    } catch (error) {
        if (error.status) throw error;
        throw HttpError(500, 'Error fetching following list');
    }
}
