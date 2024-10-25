import app from "./app.js";
import { connectDatabase } from "./Database/database.js";
import dotenv from "dotenv";

dotenv.config();

const startServer = () => {
    const port = process.env.PORT || 5000;

    const server = app.listen(port, () => {
        console.log(`App is successfully listening on port ${port}`);
    });

    server.on("error", (error) => {
        console.error("Error occurred in the app:", error);
        process.exit(1);
    });
};

connectDatabase()
    .then(() => {
        console.log("Database connected successfully.");
        startServer();
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1);
    });
