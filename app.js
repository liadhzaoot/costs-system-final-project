const express = require('express');
const mongoose = require("mongoose");
const costRouts = require("./routes/cost")
const app = express();
const port = 3000;
mongoose.connect('mongodb://localhost:27017/');
var db = mongoose.connection;
//response as Json
app.use(express.json());
app.use("/api", costRouts) // new

ObjectID = mongoose.ObjectID
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

