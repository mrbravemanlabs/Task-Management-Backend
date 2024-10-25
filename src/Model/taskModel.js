import mongoose,{Schema} from "mongoose";
const taskSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
    taskName:{
        type:String,
        required:true
    },
    taskStatus:{
        type:String,
        enum:["Pending","Active","Complete"],
        default:"Pending",
    },
    steps:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"step"
        }
    ]
},{
    timestamps:true
})
export const Task = mongoose.model("Task",taskSchema)