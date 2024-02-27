import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import jwt from './_utilities/jwt.js';
import errorHandler from './_utilities/error-handler.js';
import router from './users/users.controller.js';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(jwt());

// api routes
app.use('/users', router);

app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server is listening on port http://localhost:${process.env.PORT}/.`));