import mongoose,{Schema} from "mongoose";
const stepSchema = new Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    task:{
        type:String,
        required:true,
    },
    isComplete:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
export const Step = mongoose.model("Step",stepSchema)