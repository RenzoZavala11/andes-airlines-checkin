import db from "../db/index.js";
import { Sequelize } from "sequelize";

export const seat = db.define("seat", {
    seatId : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "seat_id"
    },
    seatColumn: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    seatRow: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    seatTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
            model: "seat_type",
            key: "seat_type_id"
        }
    },
    airplaneId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        reference: {
            model: "airplane",
            key: "airplane_id"
        }
    }
}, {
    tableName: "seat"
});