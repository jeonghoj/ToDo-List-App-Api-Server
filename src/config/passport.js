import User from '../models/User';

import passport from 'passport';
import {Strategy as LocalStrategy } from "passport-local";
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import config from "../config";

module.exports = () => {

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'password'
    },async (userId, password, done) => {
        return User.findOne({where : {userId : userId}}).then(async user => {
            if(!user){
                return done(null, false);
            }else {
                const isValidPassword = await user.validPassword(password);
                if(isValidPassword){
                    return done(null, user);
                }else {
                    return done(null,false);
                }
            }
        }).catch(err => {
            return done(err);
        })
    }));

    passport.use(new JwtStrategy({
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey : config.secretKey
    }, (jwt_payload, done) => {
        User.findOne({where : {id: jwt_payload.id}}).then(user => {
            if (!user) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        }).catch(err => {
            return done(err)
        });
    }));
};