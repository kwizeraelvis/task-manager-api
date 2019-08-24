const express =require('express');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb (undefined, true);
    }
});
const router = express.Router();
const {CreateUser, UserLogoutAll, UserLogout, UserLogin, GetAllUsers, GetUserById, deleteUser, GetProfile, updateUserInfo, deleteAvatar, getUserAvatar} = require('../controller/user');

router.post('/users',  CreateUser);

router.post('/users/login', UserLogin);

router.post('/users/logout', verifyToken, UserLogout);

router.post('/users/logoutall',verifyToken, UserLogoutAll);

router.post('/users/me/avatar', verifyToken, upload.single('avatar'),async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.get('/users/me',verifyToken, GetProfile);

router.get('/users', GetAllUsers);

router.get('/users/:id', verifyToken, GetUserById);

router.get('/users/:id/avatar', getUserAvatar);

router.patch('/users/me', verifyToken, updateUserInfo);

router.delete('/users/me', verifyToken, deleteUser);

router.delete('/users/me/avatar', verifyToken, deleteAvatar);

module.exports = router;
