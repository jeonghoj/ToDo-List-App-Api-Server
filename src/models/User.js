import {Model} from "sequelize";
import * as bcrypt from "bcrypt-nodejs";

export default class User extends Model {
    validPassword(password){
        return bcrypt.compareSync(password, this.password);
    }
}