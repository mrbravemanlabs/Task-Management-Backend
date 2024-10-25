import { Router } from "express";
import { addTask, deleteTask, getAllTasks, getCompleteTaskDetail, toggleTaskStatus } from "../Controllers/taskController.js";

const taskRoute = Router()

taskRoute.route("/addTask").post(addTask)
taskRoute.route("/getAllTasks/:userId").get(getAllTasks)
taskRoute.route("/toggleStatus/:taskId").put(toggleTaskStatus)
taskRoute.route("/deleteTask/:taskId").delete(deleteTask)
taskRoute.route("/getTaskDetails/:id").get(getCompleteTaskDetail)

export default taskRoute