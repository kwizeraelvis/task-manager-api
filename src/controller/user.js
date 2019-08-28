const User = require('../modals/user');
const { sendwelcomeEmail, sendCancellationEmail } = require('../emails/account');

async function CreateUser(req, res) {
    const user = new User(req.body);
    try {
        await user.save();
        sendwelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(404).send(e);
    }
}

 async function UserLogin(req, res) {
    try{
        const user =  await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            user, token
        });
    }catch (e) {
        res.status(400).send(e);
    }
 }

 async function UserLogout(req, res){
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await  req.user.save;
        res.send();
    } catch (e) {
        res.send().status(500)
    }
 }

 async function UserLogoutAll(req, res){
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch (e) {
        req.send().status(500);
    }
 }


async function GetProfile(req, res) {
    res.status(200).send(req.user);
}

async function GetAllUsers(req, res){
    const user = await User.find({});
    try{
        res.send(user).status(200);
    }  catch(e){
        res.send(e).status(503);
    }
}

async function GetUserById(req, res) {
    const _id = req.params.id;
    try {
        const user = User.findById(_id);
        if(!user){
            res.send().status(503)
        }
        res.send(user).status(200)
    }catch (e) {
        res.send(e).status(400)
    }
}
async function updateUserInfo(req,res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid data field'})
    }
    try {

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        });
        await req.user.save();
        if(!req.user) {
            return res.status(404).send();
        }
        res.send(req.user).status(200)
    }catch (e) {
        res.send(e).status(400);
    }
}

async function deleteUser(req, res){

    try {
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
}

async function deleteAvatar(req, res) {
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (e) {
        res.send(e).status(404);
    }
}

async function getUserAvatar(req, res){
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar)
    } catch (e) {
        res.send(e).status(404);
    }
}

module.exports = { CreateUser,GetProfile,GetUserById,updateUserInfo,deleteUser,UserLogin,UserLogout,UserLogoutAll,GetAllUsers, deleteAvatar, getUserAvatar };
