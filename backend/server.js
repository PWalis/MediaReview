import password from './EnvVariables/MongoDBVars.js';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

const uri = `mongodb+srv://pwalis:${password}@clusterwilky.k8hppvu.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri)

app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api', (req, res) => {
    res.json({"users": ["user1", "user2"]});
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`));
