const Message = require('../models/messages');
const User = require('../models/user');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

function generateAccessToken(id) {
    return jwt.sign({userId: id}, process.env.JWT_token);
}

exports.getMessage = async(req,res,next) => {
    try {
        const message = await Message.findAll();
        const user = await User.findByPk(req.user.id);
        res.status(200).json({allMessage: message, user: user, success: true})
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
        const {message} = req.body;
        const data = await Message.create({message:message, userId:req.user.id}, {transaction:t});
        console.log(data.userId);
        await t.commit();
        const user = await User.findByPk(data.userId);
        console.log(user);
        // res.status(200).json({success: true});
        res.status(200).json({newMessage: [data], user: user, token: generateAccessToken(data.userId)});
    }
    catch(err) {
        await t.rollback();
        res.status(500).json({success:false,error:err})
    }
}