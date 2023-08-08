const sequelize = require('../util/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function isStringEmpty(str) {
    if(str == undefined || str.length == 0) {
        return true;
    }
    else {
        return false;
    }
}

function generateAccessToken(id, name) {
    return jwt.sign({userId: id, username: name}, process.env.JWT_token);
}

exports.postLogin = async(req,res,next) => {
    const t = await sequelize.transaction();
    try {
        const {email, password} = req.body;
        if(isStringEmpty(email)||isStringEmpty(password)) {
            return res.status(400).json({message: "All Fields Are Mandatory", success: false})
        }
        const user = await User.findAll({where: {email}}, {transaction:t});
        if(user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err) {
                    throw new Error("Something went Wrong!")
                }
                if(result == true){
                    console.log(user[0]);
                    res.status(200).json({success: true, user: user[0], message: "Login Successful!", token: generateAccessToken(user[0].id, user[0].name)})
                }
                else {
                    res.status(401).json({success: false, message: "Password is Incorrect!"})
                }
            })
        }
        else {
            res.status(404).json({success: false, message: "User Not Found"})
        }
        await t.commit();
    }
    catch(err) {
        await t.rollback();
        res.status(500).json({message: err, success: false})
    }
}
