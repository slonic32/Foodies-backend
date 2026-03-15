import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/authControllers.js';
import { auth } from '../middlewares/authMiddleware.js';
import { registerSchema, loginSchema } from '../schemas/userSchemas.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), registerUser);

authRouter.post('/login', validateBody(loginSchema), loginUser);

authRouter.get('/logout', auth, logoutUser);

export default authRouter;

/*
========================================
Swagger docs
========================================
*/

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Artem
 *               email:
 *                 type: string
 *                 format: email
 *                 example: artem@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Artem
 *                 email:
 *                   type: string
 *                   example: artem@example.com
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       409:
 *         description: Email in use
 *
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: artem@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Artem
 *                     email:
 *                       type: string
 *                       example: artem@example.com
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *       401:
 *         description: Email or password is wrong
 *
 * /api/auth/logout:
 *   get:
 *     summary: Logout current user
 *     tags: [Auth API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User successfully logged out
 *       401:
 *         description: Not authorized
 *
 * /api/auth/current:
 *   get:
 *     summary: Get current user
 *     tags: [Auth API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Artem
 *                 email:
 *                   type: string
 *                   example: artem@example.com
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Not authorized
 */
