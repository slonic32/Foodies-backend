import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import { connectDatabase } from './db/connectDatabase.js';



import { globalErrorHandler } from './helpers/globalErrorHandler.js';

import authRouter from './routes/authRouter.js';
import usersRouter from './routes/usersRouter.js';
import categoriesRouter from './routes/categoriesRouter.js';

import recipesRouter from './routes/recipesRouter.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './helpers/swagger.js';
import testimonialsRouter from './routes/testimonialsRouter.js';

try {
    await connectDatabase();
    console.log('Database connection successful');
} catch (error) {
    console.log(error.message);
    process.exit(1);
}

const app = express();

// base path
const pathPrefix = '/api';

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// path for API documentation
app.use(`${pathPrefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`${pathPrefix}/auth`, authRouter);
app.use(`${pathPrefix}/users`, usersRouter);

app.use(`${pathPrefix}/recipes`, recipesRouter);

app.use(express.static('public'));

app.use('/api/testimonials', testimonialsRouter);
app.use('/api/categories', categoriesRouter);

app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running. Use our API on port: ', port);
});
