import { db } from "../config/db.js";
import { Sequelize } from "sequelize";

export const seat_type = db.define("seat_type", {
    seatTypeId : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "seat_type_id"
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: "seat_type"
});