import { Router } from 'express';
import { getIngredientsController } from '../controllers/ingredientsController.js';

const ingredientsRouter = Router();

ingredientsRouter.get('/', getIngredientsController);

export default ingredientsRouter;
