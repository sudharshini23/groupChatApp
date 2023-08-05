const Message = require('../models/messages');
const User = require('../models/user');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

function generateAccessToken(id, name) {
    return jwt.sign({userId: id, name: name}, process.env.JWT_token);
}

exports.getMessage = async(req,res,next) => {
    try {
        const message = await Message.findAll();
        // const user = await User.findByPk(req.user.id);
        res.status(200).json({allMessage: message, success: true})
    }
    catch(err) {
        console.log('Failed to get messages', JSON.stringify(err));
        res.status(500).json({error: err, success: false})
    }
}

exports.postMessage = async(req,res,next) => {
    const t = await sequelize.transaction();
    try {
        console.log(req.body);
        const {message,username} = req.body;
        const data = await Message.create({message:message, name: username, userId:req.user.id}, {transaction:t});
        console.log(data.userId);
        // const user = await User.findByPk(data.userId, data.username);
        // console.log(user);
        await t.commit();
        // res.status(200).json({success: true});
        res.status(200).json({newMessage: [data], token: generateAccessToken(data.userId, data.name)});
    }
    catch(err) {
        await t.rollback();
        res.status(500).json({success:false,error:err})
    }
}