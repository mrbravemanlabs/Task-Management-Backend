import mongoose from "mongoose";
import { databaseName } from "../constants.js";

export async function connectDatabase() {
    console.log(process.env.DATABASE_URL);

    try {
        const connectionInstance = await mongoose.connect(`mongodb://localhost:27017/${databaseName}`);

        console.log("Database successfully connected.");
        console.log(`Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}
