import app from "./app.js";
import { connectDatabase } from "./Database/database.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 4000;
connectDatabase()
    .then(() => {
        app.on("error", (error) => {
            console.error("Error occurred in the app:", error);
            process.exit(1);
        })
        app.listen(port , () => {
            console.log(`App is successfully listening on port ${port}`)
        })

    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1);
    });
