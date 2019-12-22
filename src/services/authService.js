import passport from "passport";
import User from "../models/User";
import * as jwt from 'jsonwebtoken'
import config from "../config";

export async function register(userId, password) {
    // check input valid

    // Duplicate User check
    const user = await User.findOne({ where : { userId } });
    if(user){
        return null;
    }
    return await User.create({ userId, password });
}

export async function login(req,res,next) {
    passport.authenticate('local', {session:false},(err,user) =>{
        if (err) {
            console.log("here",err);
            return res.status(401).json({
            msg: "Check ID, Password Please"
        }) }
        if (!user) {
            return res.status(404).json({
            msg: "Something Error, Please Re-Login"
        }) }
        req.logIn(user, (err) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            const token = jwt.sign(user.toJSON(), config.secretKey);
            return res.json({
                data: {
                    token
                },
                msg: "Login Success"
            })
        });
    })(req,res,next);
}