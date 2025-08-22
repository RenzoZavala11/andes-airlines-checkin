import db from "../db/index.js";
import { Sequelize } from "sequelize";

export const purchase = db.define("purchase", {
    purchaseId : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: "purchase_id"
    },
    purchaseDate: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    tableName: "purchase"
});