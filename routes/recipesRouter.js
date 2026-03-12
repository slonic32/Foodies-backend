import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createRecipeSchema, searchRecipesSchema } from '../schemas/recipesSchemas.js';
import * as recipeController from '../controllers/recipesControllers.js';

const recipesRouter = express.Router();

recipesRouter.get('/', validateBody(searchRecipesSchema, 'query'), recipeController.getAll);

recipesRouter.get('/popular', recipeController.getPopular);

recipesRouter.get('/own', auth, recipeController.getOwn);

recipesRouter.get('/:id', recipeController.getById);

recipesRouter.post('/', auth, validateBody(createRecipeSchema), recipeController.create);

recipesRouter.delete('/:id', auth, recipeController.remove);

export default recipesRouter;
