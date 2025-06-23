import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../config/generateToken.js";  // Fixed typo in 'generateToken'

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { name, email, phone, password, pic } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  // Check if the user already exists by email or phone
  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const newUser = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    pic, // Optional profile picture
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      pic: newUser.pic,
      token: generateToken(newUser._id),  // Fixed typo in 'generateToken'
      message: "User registered successfully",
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

// Auth User (Login)
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {  // Use bcrypt to compare passwords
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// /api/user?search=piyush
export const allUsers=asyncHandler(async(req,res)=>{
  const keyword=req.query.search?{
    $or:[
      {name:{$regex:req.query.search,$options:"i"}},
      {email:{$regex:req.query.search,$options:"i"}},
    ]
  }:{};
  // regex provides expression capapbilities for pattern matching strings in queries 
  // i: case insensitivity
  
  // console.log(keyword);

  
  const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
  res.send(users);
});

