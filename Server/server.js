const express = require('express');

const port = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send("Finance Tracker Application.");
});

app.listen(port, () => console.log(`Server is listening on port http://localhost:${port}/.`));