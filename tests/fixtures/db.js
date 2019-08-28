const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/modals/user');

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name:"elvis",
    email:"elvis@gmail.com",
    password:"elvis123",
    tokens:[{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
};

const userTwo = {
    _id: userTwoId,
    name:"emile",
    email:"emile@gmail.com",
    password:"emile123",
    tokens:[{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
};

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save();
}

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    setupDatabase
}