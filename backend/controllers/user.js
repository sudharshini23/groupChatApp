const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

function isStringEmpty(str) {
    if(str==undefined || str.length==0) {
        return true;
    }
    else {
        return false;
    }
}

function generateAccessToken(id, name) {
    return jwt.sign({userId: id, username: name}, process.env.JWT_token);
}

exports.addUser = async(res,res,next) => {
    const t = await sequelize.transaction();
    try {
        const {name,email,phone,password} = req.body;
        const users = await User.findAll();
        for(let i=0;i<users.length;i++) {
            if(users[i].email==email) {
                return res.status(403).json({message:"User Already Exist!",success:false});
            }
        }
        if(isStringEmpty(name)||isStringEmpty(email)||isStringEmpty(password)||isStringEmpty(phone)){
            return res.status(400).json({message:"All Fields Are Mandatory",success:false});
        }
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=> {
            await User.create({name:name,email:email,phone:phone,password:hash},{transaction:t});
            await t.commit();
            res.status(200).json({message:"New User Created",success:true});
        })
    }
    catch(err){
        await t.rollback();
        console.log("err");
        res.status(500).json({message:err,success:false})
    }
}

exports.logUser = async (req,res,next) => {
    const t = await sequelize.transaction();
    try {
        const {email,password}= req.body;
        if(isStringEmpty(email)||isStringEmpty(password)){
            return res.status(400).json({message:"All Fields Are Mandatory",success:false});
        }
        const user = await User.findAll({where:{email}},{transaction:t});
        if(user.length>0) {
            bcrypt.compare(password,user[0].password,(err,result)=> {
                if(err){
                    throw new Error("Something Went Wrong");
                }
                if(result===true){
                    // console.log(user[0])
                    res.status(200).json({success:true,message:"Login Successfull",logeduser:user,token:generateAccessToken(user[0].id,user[0].name)});
                }else{
                    res.status(401).json({success:false,message:"Password is Incorrect"});
                }
            })
        }
        else{
            res.status(404).json({success:false,message:"User Not Found"});
        }
        await t.commit();
    }
    catch(err){
        await t.rollback();
         // console.log(err);
         res.status(500).json({message:err,success:false});
    }
}