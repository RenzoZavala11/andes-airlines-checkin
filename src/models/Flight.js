import db from "../db/index.js";
import { Sequelize } from "sequelize";

export const flight = db.define("flight", {
    flightId : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "flight_id"
    },
    takeoffDateTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "takeoff_date_time"
    },
    takeoffAirport: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "takeoff_airport"
    },
    landingDateTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "landing_date_time"
    },
    landingAirport: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "landing_airport"
    },
    airplaneId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "airplane_id",
        references: {
            model: "airplane",
            key: "airplane_id"
        }
    }
}, {
    tableName: "flight"
});