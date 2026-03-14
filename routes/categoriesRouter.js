import { Router } from 'express';
import { getCategoriesController } from '../controllers/categoriesController.js';

const categoriesRouter = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get list of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */


categoriesRouter.get('/', getCategoriesController);

export default categoriesRouter;
