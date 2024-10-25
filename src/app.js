import express from "express";
import userRoute from "./Router/userRoute.js";
import cors from "cors";
import bodyParser from "body-parser";
import  taskRoute from "./Router/taskRoute.js";
import stepRoute from "./Router/stepRoute.js"

const app = express();
app.use(bodyParser.json())
app.use(cors(
    {
        origin:"https://mrbravemanlabs.github.io"
    }
));
app.use(express.json());
app.get("/api/v1/users", (req, res) => {
    console.log(req.params);
    console.log("passed From here");
    res.send("GET request to /api/v1/users received");
});
app.use("/api/v1/users", userRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/steps", stepRoute);
export default app;
