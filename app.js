import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import { connectDatabase } from './db/connectDatabase.js';

import { globalErrorHandler } from './helpers/globalErrorHandler.js';

import authRouter from './routes/authRouter.js';
import usersRouter from './routes/usersRouter.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './helpers/swagger.js';

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

app.use(express.static('public'));

app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running. Use our API on port: ', port);
});

try {
    await connectDatabase();
    console.log('Database connection successful');
} catch (error) {
    console.log(error.message);
    process.exit(1);
}
