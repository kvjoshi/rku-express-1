import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    "userName":{
        type:String,
        // it is req and unique
        required:true,
        // unique:true
    },
    "name":{
        type:String,
        required:true
    },
    "email":{
        type:String,
        required:true,
        // unique:true
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


// this is automatically called when any save ony save operation is performed.

userSchema.pre("save", async function (next) {
//checking if password is not modified
    if (!this.isModified("password")) {
        //if it is not modified the move to next middleware
    next();
  }
  // salt generator
  //hashing the password and storing it in the password field
  const salt = await bcrypt.genSalt(10);
  // NOT#111 -> $2a$12$OCV2/hqjXREd.XTom1L96OsmiIgj8rOqHpI/EOfSfmH1FJ01jIEvy
   this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (enteredPassword) {
  console.log("this is working");

    // this will check if the entered password is same as the password stored in the database
    // will perform the hashing and then compare the password
  return bcrypt.compare(enteredPassword, this.password);
};

// this is used to remove the password from the user object
userSchema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.password;
    return user;
}

//creating indexes for the user schema for faster search operations

userSchema.index({email:1});

userSchema.index({userName:1});

const User = mongoose.model("user", userSchema);
export default User;