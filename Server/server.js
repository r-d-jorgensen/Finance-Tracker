require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');

const jwt = require('./_utilities/jwt');
const errorHandler = require('./_utilities/error-handler');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));

app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server is listening on port http://localhost:${process.env.PORT}/.`));