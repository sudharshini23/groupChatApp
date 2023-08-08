const express = require('express');
const path = require('path');
require('dotenv').config();

const cors = require('cors');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const app = express();

app.use(cors({
    origin: '*',
}));
app.use(bodyParser.json());

const User = require('./models/user');
const Message = require('./models/messages');
const Group = require('./models/group');
const GroupUser = require('./models/groupUser');
const Forgotpassword = require('./models/forgot-password')

User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User, {through: GroupUser});
User.belongsToMany(Group, {through: GroupUser});

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messages');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const passwordRoutes = require('./routes/password');
const { error, group } = require('console');


app.use(express.json());

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/chat', chatRoutes);
app.use('/admin', adminRoutes);
app.use('/password', passwordRoutes);

// app.use('/', (req, res) => {
//     res.sendFile(path.join(__dirname, `public/views/${req.url}`));
// });

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})