import db from "../db/index.js";
import { Sequelize } from "sequelize";

export const boarding_pass = db.define("boarding_pass", {
    boardingPassId : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "boarding_pass_id"
    },
    purchaseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "purchase",
            key: "purchase_id"
        }
    },
    passengerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "passenger",
            key: "passenger_id"
        }
    },
    seatTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "seat_type",
            key: "seat_type_id"
        }
    },
    seatId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: "seat",
            key: "seat_id"
        }
    },
    flightId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "flight",
            key: "flight_id"
        }
    }
}, {
    tableName: "boarding_pass"
});