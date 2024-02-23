const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Finance Tracker Application.");
});

app.listen(port, () => console.log(`Server is listening on port http://localhost:${port}/.`));