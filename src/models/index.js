import { Sequelize } from 'sequelize';
import config from "../config";
import * as bcrypt from "bcrypt-nodejs";
import Task from "./Task";
import User from "./User";

export function init() {
    const connectionUrl = config.db.url;
    const sequelize = new Sequelize(connectionUrl);
    User.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: Sequelize.STRING(20),
            unique: true,
            autoIncrement: false,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING(150),
            allowNull: false,
        }
    },{
        sequelize,
        tableName: "users",
        charset: 'utf8',
        indexes: [
            {
                fields: ["userId"]
            }
        ],
        hooks: {
            beforeCreate: async (user) => {
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },
    });

    Task.init({
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        targetDate: {
            type: Sequelize.DATE,
        },
        content: {
            type: Sequelize.STRING(300),
            allowNull: false,
        },
        isCompleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'tasks',
        charset: 'utf8',
    });
    User.hasMany(Task, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'tasks',
    });

    return sequelize;
}