const Message = require('../models/messages');
const User = require('../models/user');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');
const {Sequelize} = require('sequelize');


function generateAccessToken(id, name) {
    return jwt.sign({userId: id, name: name}, process.env.JWT_token);
}

exports.getMessage = async(req,res,next) => {
    try {
        // const message = await Message.findAll();
        // const user = await User.findByPk(req.user.id);
        // res.status(200).json({allMessage: message, user: user, success: true})
        const msgId = req.query.messageid;
        if(msgId==undefined || msgId==null){
            const message = await Message.findAll();
            res.status(200).json({allMessage:message,success:true});
        }
        else {
            const message = await Message.findAll();
            const message10 = [];
            let msgcount=0;
            for(let i=message.length-1;i>=0;i--){
                if(msgcount==10)
                    break;
                message10.unshift(message[i]);
                msgcount++;
                // console.log(message[i])
            }
            res.status(200).json({allMessage:message10,success:true});
        }
    }
    catch(err) {
        console.log('Failed to get messages', JSON.stringify(err));
        res.status(500).json({error: err, success: false})
    }
}

exports.postMessage = async(req,res,next) => {
    const t = await sequelize.transaction();
    try {
        console.log("Hello", req.body);
        const {message, username} = req.body;
        console.log("This is the req userid inside postmessage", req.user.id);
        const data = await Message.create({message:message, username: username, userId:req.user.id}, {transaction:t});
        console.log("Data", data.userId);
        // const user = await User.findByPk(data.userId);
        // console.log(user);
        await t.commit();
        // res.status(200).json({success: true});
        res.status(200).json({newMessage: [data], token: generateAccessToken(data.userId, data.username)});
    }
    catch(err) {
        await t.rollback();
        res.status(500).json({success:false,error:err})
    }
}