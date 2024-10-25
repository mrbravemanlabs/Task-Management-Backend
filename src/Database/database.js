import mongoose from "mongoose";
import { databaseName } from "../constants.js";

export async function connectDatabase() {
    const dbUrl = "mongodb+srv://mrbravemanlabs:mrbravemanlabs@cluster0.o1oyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    try {
        const connectionInstance = await mongoose.connect(`${dbUrl}/${databaseName}`);

        console.log("Database successfully connected.");
        console.log(`Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}
