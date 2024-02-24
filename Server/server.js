require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./utilities/connection');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Finance Tracker Application.");
});

app.post('/login', async (req, res) => {
    console.log(req.body);
    const sql = `SELECT * FROM account_book WHERE book_name = ${req.body.username} AND book_password = ${req.body.password}`;
    const [rows] = await connection.promise().query(sql);
    console.log(rows);
    res.send("Token");
});

app.listen(process.env.PORT, () => console.log(`Server is listening on port http://localhost:${process.env.PORT}/.`));