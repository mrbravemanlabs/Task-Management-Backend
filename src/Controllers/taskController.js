import { handleErrorResponse } from "../utils/utilsFun.js";
import { Task } from "../Model/taskModel.js";
import { Step } from "../Model/stepModel.js";

// Add a new task
export const addTask = async (req, res) => {
    try {
        const { userid, taskName, tasksSteps } = req.body;
        if (!userid || !taskName) {
            return handleErrorResponse(res, 404, "userId and taskName are required", "taskAdded", false);
        }

        const createdTask = new Task({ taskName, userId: userid });
        const savedTask = await createdTask.save();

        const stepsPromise = tasksSteps.map(async (step) => {
            const newStep = new Step({
                taskId: savedTask._id,
                task: step,
                isComplete: false
            });
            const savedStep = await newStep.save();
            savedTask.steps.push(savedStep._id);
            return savedStep;
        });
        await Promise.all(stepsPromise);
        await savedTask.save();

        return res.status(201).json({
            message: "Task and steps created successfully",
            taskAdded: true,
            task: savedTask
        });
    } catch (error) {
        console.error("Error adding task:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            taskAdded: false
        });
    }
};

// Get all tasks for a user
export const getAllTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return handleErrorResponse(res, 404, "userId is required", "taskFound", false);
        }

        const allTasks = await Task.find({ userId }).sort({ createdAt: -1 }).select("createdAt taskName taskStatus").exec();
        return res.status(200).json({
            message: allTasks.length ? "All tasks found" : "No tasks found for this user",
            taskFound: true,
            tasks: allTasks.length ? allTasks : []
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return handleErrorResponse(res, 500, "Internal Server Error", "taskFound", false);
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    if (!taskId) {
        return res.status(400).json({ message: "Task ID is required." });
    }

    try {
        // Delete all associated steps
        const steps = await Step.find({ taskId });
        const stepsPromise = steps.map(async (step) => {
            const deletedStep = await Step.findByIdAndRemove(step._id);
            return !!deletedStep; // Return true if deleted, false if not found
        });
        const deletedAllSteps = await Promise.all(stepsPromise);

        // Log deletion status for each step
        const allStepsDeleted = deletedAllSteps.every((status) => status);
        if (!allStepsDeleted) {
            return res.status(400).json({ message: "Can't Delte All The Steps" });
        }

        // Delete the task itself
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found." });
        }

        return res.status(200).json({
            message: "Task and associated steps deleted successfully",
            taskId
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Toggle task status (Active/Inactive)
export const toggleTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { taskStatus } = req.body;
    console.table({ taskId, taskStatus });
    if (!taskStatus) {
        return handleErrorResponse(res, 400, "Please provide the task status", "taskStatusChanged", false);
    }
    try {
        const hasActiveTask = await Task.exists({ taskStatus: "Active" });
        if (hasActiveTask && taskStatus === "Active") {
            return handleErrorResponse(res, 400, "You already have an active task", "taskStatusChanged", false);
        }
        const task = await Task.findById(taskId);
        if (!task) {
            return handleErrorResponse(res, 404, "Cannot find the task with this ID", "taskStatusChanged", false);
        }
        task.taskStatus = taskStatus;
        await task.save();
        return res.status(200).json({
            message: "Task status updated successfully",
            taskStatusChanged: true
        });
    } catch (error) {
        return handleErrorResponse(res, 500, "Internal server error", "taskStatusChanged", false);
    }
};

// Get details of a complete task
export const getCompleteTaskDetail = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return handleErrorResponse(res, 404, "Cannot Find The Task With This Id", "taskFound", false);
        }

        const task = await Task.findById(id).select("taskName taskStatus");
        if (!task) {
            return handleErrorResponse(res, 404, "Cannot Find The Task", "taskFound", false);
        }

        const steps = await Step.find({ taskId: task._id }).select("task isComplete");
        res.status(200).json({ task, steps });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
