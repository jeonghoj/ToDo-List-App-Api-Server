import express from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import * as DB from './models/index';

import passport from "passport";
import passportConfig from "./config/passport";

const authRouter = require('./api/auth');
const taskRouter = require('./api/task');

const stopServer = async (server, sequelize, signal) => {
    console.log(`Stopping server with signal: ${signal}`);
    await server.close();
    await sequelize.close();
    process.exit();
};

async function runServer() {
    const sequelize = DB.init();
    const app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(passport.initialize());
    passportConfig();

    app.use('/', authRouter);
    app.use('/task', taskRouter);

    app.use((req,res,next) => {
        res.status(404)
    });
    app.use((err,req,res,next) => {
        console.error(err.stack);
        res.status(500)
    });

    const server = app.listen(3000, ()=>{
        console.log("listening");
    });

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        // await sequelize.sync({
        //     force: true
        // });
    }catch (e) {
        console.error(e);
        await stopServer(server,sequelize);
        throw e;
    }
};

runServer()
    .then(() => {
        console.log("success");
    })
    .catch((err) => {
        console.error(err);
    });