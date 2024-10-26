import { Step } from "../Model/stepModel.js";
import { handleErrorResponse } from "../utils/utilsFun.js"

export const toggleStepStatus = async (req,res) => {
    try {
        const {stepId} = req.params;
        console.log(stepId);
        if(!stepId){
        return handleErrorResponse(res, 404, "Provide An Step Id", "updatedStatus", false);
        }
        const existedStep = await Step.findById({_id:stepId})
        if(!existedStep){
            return handleErrorResponse(res, 404, "Step Not Found", "updatedStatus", false);
        }
        existedStep.isComplete =  !existedStep.isComplete;
        existedStep.save()
        return res.status(200).json(
            {
                message:existedStep.isComplete? "Pending Step" : "Completed Step",
                updatedStatus:true
            }
        )

    } catch (error) {
        return handleErrorResponse(res, 500, "Internal Server Error", "updatedStatus", false);
    }
}