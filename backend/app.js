const express = require('express');
require('dotenv').config();

const cors = require('cors');

const sequelize = require('./util/database');

const userModel = require('./models/user');
const messageModel = require('./models/messages');

const app = express();

app.use(cors({
    origin: '*',
}));

const userRoutes = require('./routes/user');

app.use(express.json());

app.use('/user', userRoutes);

userModel.hasMany(messageModel);
messageModel.belongsTo(userModel);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})