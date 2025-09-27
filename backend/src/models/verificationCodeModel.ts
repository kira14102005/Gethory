import mongoose from "mongoose";



const verifSchema = new mongoose.Schema({
    userID:  {type : mongoose.Schema.Types.ObjectId, ref: "User", required: true, index:  true},
    type:  {type : String , required: true},
    createdAt: {type: Date, default: Date.now, required : true}, 
    expiresAt: {type: Date, required : true},
})

const VerificationModel   = mongoose.model("VerificationCode", verifSchema,  "verification_codes")
export default VerificationModel