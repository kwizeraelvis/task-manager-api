const jwt = require('jsonwebtoken');
const User = require('../modals/user');
const dotenv = require('dotenv');

dotenv.config();



async function verifyToken(req, res, next) {
        try {
                const token = req.header('Authorization').replace('Bearer ','');
                const decoded = jwt.verify(token, 'blackcable');
                const user = await User.findOne({ _id: decoded._id, 'tokens.token':token });
                if(!user){
                    throw new Error();
                }
                req.token = token;
                req.user = user;
                next()
        } catch (e) {
                res.status(401).send({Message: 'Please Authenticate'});
                console.log(e);
       }
}


module.exports = { verifyToken };
