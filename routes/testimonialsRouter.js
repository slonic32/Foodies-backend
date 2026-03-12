import { Router } from 'express';
import { getTestimonialsController } from '../controllers/testimonialsController.js';

const testimonialsRouter = Router();

testimonialsRouter.get('/', getTestimonialsController);

export default testimonialsRouter;
