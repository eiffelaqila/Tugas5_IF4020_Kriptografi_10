import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
    },
    gender:{
        type: String,
        required:true,
        enum:["male", "female"]
    },
    profilePic:{
        type: String,
        default: "",
    }
})

const User = mongoose.model("User", userSchema)
export default User