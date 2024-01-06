const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connect = require('./db/db');
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(require('./router/order'))
app.use(require('./router/manufacture'))
app.use(require('./router/inventory'))

connect();

app.listen(5000 , ()=>{
    console.log(`server is running on port ${port}`);
});