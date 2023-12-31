const jwt = require('jsonwebtoken');

const User = require('../models/user');

const authenticate = (req,res,next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, process.env.JWT_token);
        // console.log("userID",user.id);
        User.findByPk(user.userId)
        .then(user => {
            req.user = user;
            next();
        })
    }
    catch(err) {
        console.log(err);
        return res.status(401).json({success:false});
    }
}

module.exports = {authenticate}