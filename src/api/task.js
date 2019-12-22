import express from 'express';
const router = express.Router();

import * as taskService from '../services/taskService';
import passport from "passport";

router.get('/',passport.authenticate('jwt',{session:false}),async (req,res) =>{
    const userId = req.user.id;
    const taskList = await taskService.getTaskList(userId);
    res.json({
        task: taskList
    })
});

router.post('/',passport.authenticate('jwt',{session:false}), async (req,res) => {
    // task create
    const userId = req.user.id;
    const task = req.body;
    const result = await taskService.createTask(userId, task);
    res.json({
        data:result,
        msg : "Created Successful"
    })
});

router.put('/:id',passport.authenticate('jwt',{session:false}), async (req,res) => {
    // task modify
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = req.body;
    const result = await taskService.modifyTask(userId, taskId, task);
    res.json({
        data:result,
        msg : "Modify Successful"
    })
});

router.delete('/:id',passport.authenticate('jwt',{session:false}),async (req,res) => {
    // task delete
    const userId = req.user.id;
    const taskId = req.params.id;
    const result = await taskService.deleteTask(userId, taskId);
    res.json({
        data:result,
        msg : "Delete Successful"
    })
});

module.exports = router;
