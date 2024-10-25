import { Router } from "express";
import { toggleStepStatus } from "../Controllers/stepController.js";

const stepRoute = Router()

stepRoute.route("/toggleStatus/:stepId").put(toggleStepStatus)

export default stepRoute