import { db } from "../config/db.js";
import { Sequelize } from "sequelize";

export const passenger = db.define("passenger", {
    passengerId : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "passenger_id"
    },
    dni: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    country: {
        type: Sequelize.STRING,
        allowNull:  false
    }
}, {
    tableName: "passenger"
});