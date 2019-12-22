import Task from "../models/Task";

export function getTaskList(userId) {
    return Task.findAll({where: {userId}})
}

export function createTask(userId, task) {
    return Task.create({
        ...task,
        userId
    })
}

export function modifyTask(userId, taskId, task) {
    return Task.update({
        ...task,
    },{where : {
        id:taskId,
        userId}});
}

export function deleteTask(userId, taskId) {
    return Task.destroy({where : {
        id : taskId,
        userId
    }});
}