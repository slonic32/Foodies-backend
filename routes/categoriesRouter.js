import { Router } from 'express';
import { getCategoriesController } from '../controllers/categoriesController.js';

const categoriesRouter = Router();

categoriesRouter.get('/', getCategoriesController);

export default categoriesRouter;
