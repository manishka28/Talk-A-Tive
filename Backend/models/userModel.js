import mongoose from "mongoose";

const userSchema=mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  phone:{
    type:Number,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  pic:{
    type:String,
    required:true,
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
},
{
  timestamps:true
},
);

userSchema.method.matchPassword=async function (enteredPass){
  return await bcrypt.compare(enteredPass,this.password);
}

export const User=mongoose.model("User",userSchema);
