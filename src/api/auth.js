import express from 'express';
const router = express.Router();

import * as authService from '../services/authService';

router.post('/register', async (req,res) => {
    const {userId, password} = req.body;
    console.log(userId,password);
    const createdUser = await authService.register(userId, password);
    if(!createdUser){
        res.json({
            msg: "User already exist"
        })
    }else {
        res.json({
            data: {
                id : createdUser.id
            },
            msg : "Register Success"
        })
    }
});

router.post('/login', authService.login);

module.exports = router;
