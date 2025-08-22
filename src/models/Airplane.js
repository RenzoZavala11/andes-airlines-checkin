import { db } from "../config/db.js";
import { Sequelize } from "sequelize";

export const Airplane = db.define("airplane", {
    airplaneId : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    }
}, {
    tableName: "airplane"
});