const express = require('express');
require('dotenv').config();

const cors = require('cors');

const sequelize = require('./util/database');

const app = express();

app.use(cors());

const userRoutes = require('./routes/user');

app.use(express.json());

app.use('/user', userRoutes);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})