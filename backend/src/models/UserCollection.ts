import mongoose from "mongoose";
import { compareHash, hashValue } from "../utils/hash";
import { BACKEND_URL } from "../constants/env";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        username: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            get: (avatar: string) => {
                return `${BACKEND_URL}/storage/${avatar}`
            }
        },

        verified: {
            type: Boolean,
            default: false,
            required: true,
        },
        profileCompleted: {
            type: Boolean,
            default: false,
            required: true,
        }
    },
    {
        timestamps: true,
        toJSON : {getters : true}
    }
);

// Adding Some Mongoose Hoooks thar act as triggers
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await hashValue(this.password)
    console.log(this.password)
    next()
})

// Also add a method to the USer Schema to check if the password is matches the hash stored in the database
userSchema.methods.isPasswordMatch = async function (password: string) {
    return await compareHash(password, this.password)
}

userSchema.methods.omitPassword = function () {
  const obj = this.toObject ? this.toObject({ getters: true }) : this;
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema)
export default User