const express = require('express');
const path = require('path');
require('dotenv').config();

const cors = require('cors');
const bodyParser = require('body-parser');

const multer = require('multer');
const upload = multer();

const sequelize = require('./util/database');
const CronJob = require('cron').CronJob;
const http = require('http');
const socketio = require('socket.io');


const User = require('./models/user');
const Message = require('./models/messages');
const Group = require('./models/group');
const GroupUser = require('./models/groupUser');
const Forgotpassword = require('./models/forgot-password')
const Files = require('./models/groupfiles');
const Archieve = require('./models/archieve-chat')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors({
    origin: '*',
}));
app.use(bodyParser.json());


const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messages');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const passwordRoutes = require('./routes/password');
const fileRoutes = require('./routes/group-files')

app.use(express.json());

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/chat', chatRoutes);
app.use('/admin', adminRoutes);
app.use('/password', passwordRoutes);
app.use('/file', upload.single('myfile'), fileRoutes)

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, `${req.url}`));
});

sequelize.sync()
.then(() => {
    server.listen(3000, () => {
        console.log('server is listening')
    })
    io.on('connection', (socket) => {
        console.log('user connected');
        socket.on('send-message', (msg,id) => {
            console.log('groupId :',id);
            console.log('Received message:',msg);
            io.emit('receivedMsg', id);
        })
        socket.on('disconnect', () => {
            console.log('user disconnected');
        })
    })
    new CronJob('0 0 * * *', async function() {
        const chats = await Message.findAll();
        console.log('daily chat',chats);

        for(const chat of chats) {
            await Archieve.create({ groupId: chat.groupId, userId: chat.userId, message: chat.message })
            console.log('id',chat.id)
            await Message.destroy({where: {id: chat.id} })
        }
    },
    null,
    true,
    )
})
.catch(error => console.log("error in appjs file"));


// sequelize.sync()
// .then(result => {
//     app.listen(3000);
// })
// .catch(err => {
//     console.log(err);
// })