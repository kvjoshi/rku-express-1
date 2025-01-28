import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    "userName":{
        type:String,
        required:true,
        unique:true
    },
    "email":{
        type:String,
        required:true,
        unique:true
    },
    "password":{
        type:String,
        required:true
    },
    "role":{
        type:String,
        required:true
    }

},{timestamps:true});

userSchema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.password;
    return user;
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  // salt generator
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (enteredPassword) {
  console.log("this is working");
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({email:1});
userSchema.index({userName:1});


const User = mongoose.model("user", userSchema);
export default User;