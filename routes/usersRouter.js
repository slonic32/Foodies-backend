import express from 'express';
import {
    updateAvatar, getCurrentUserInfo, getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    getUserInfo
} from '../controllers/usersControllers.js';
import { auth } from '../middlewares/authMiddleware.js';

import { uploadImage } from '../middlewares/imgMiddleware.js';

const usersRouter = express.Router();

usersRouter.patch('/avatar', auth, uploadImage, updateAvatar);

// get current user
usersRouter.get('/current', auth, getCurrentUserInfo);

usersRouter.get('/followers', auth, getFollowers);
usersRouter.get('/following', auth, getFollowing);
usersRouter.get('/:id', auth, getUserInfo);

usersRouter.post('/follow/:id', auth, followUser);
usersRouter.delete('/follow/:id', auth, unfollowUser);

export default usersRouter;

/*
========================================
Swagger docs
========================================
*/

/**
 * @swagger
 * /api/users/avatar:
 *   patch:
 *     summary: Update user avatar
 *     tags: [User API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   example: /avatars/user-avatar.jpg
 *       401:
 *         description: Not authorized
 */
