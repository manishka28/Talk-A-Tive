import expressAsyncHandler from "express-async-handler";
import { Chat } from "../models/chatModal.js";
import { User } from "../models/userModel.js";

export const accessChat=expressAsyncHandler(async(req,res)=>{
  const {userId}=req.body;

  if(!userId){
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  let isChat=await Chat.find({
    isGroupChat:false,
    $and:[
      {users:{$elemMatch:{$eq:req.user._id}}},
      {users:{$elemMatch:{$eq:userId}}},
    ],

// -password -> everything except password
  }).populate("users","-password")
  .populate("latestMessage");
  isChat=await User.populate(isChat,{
    path:'latestMessage.sender',
    select:"name pic email",
  });

  if(isChat.length>0){
    res.send(isChat[0]);
  }else{
    var chatData={
      chatName:"sender",
      isGroupChat:false,
      users:[req.user._id,userId],
    };

    try{
      const createdChat=await Chat.create(chatData);
      const FullChat=await Chat.findOne({_id:createdChat._id}).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat)

    }catch(err){
      console.log(err);
      
      res.status(400)
      throw new Error(err.message);

    }
  }


});

export const fetchChats=expressAsyncHandler(async(req,res)=>{
  try{
    Chat.find({users:{$elemMatch: {$eq:req.user._id}}})
    .populate("users","-password")
    .populate("groupAdmin","-password")
    .populate("latestMessage")
    .sort({updatedAr:-1})
    .then(async(results)=>{
      results=await User.populate(results,{
        path:"latestMessage.sender",
        select:"name pic email",
      });
      res.status(200).send(results);
    });

  }catch(err){
    console.log(err);
    res.status(400)
    throw new Error(err.message);
  }
});

export const createGroupChat=expressAsyncHandler(async(req,res)=>{
  if(!req.body.users || !req.body.name){
    return res.status(400).send({message:"Please fill all the fields"});
  }
  let users=JSON.parse(req.body.users);
  if(users.length<2){
    return res.status(400).send("More than 2 users required for group chat");
  }
  users.push(req.user);
  try{
    const groupChat=await Chat.create({
      chatName:req.body.name,
      users:users,
      isGroupChat:true,
      groupAdmin:req.user,
    });

    const fullGroupChat=await Chat.findOne({_id:groupChat._id})
    .populate("users","-password")
    .populate("groupAdmin","-password");
    res.status(200).json(fullGroupChat);

  }catch(err){
    console.log(err);
    res.status(400);
    throw new Error(err.message);
  }
});
export const renameGroup=expressAsyncHandler(async(req,res)=>{
  const {chatId,chatName}=req.body;
  const updatedChat=await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName:chatName
    },{
      new:true,
    }
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if(!updatedChat){
    res.status(400)
    throw new Error("Chat not found!");

  }else{
    res.json(updatedChat);
  }
});
export const addToGroup=expressAsyncHandler(async(req,res)=>{
  const {chatId,userId}=req.body;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  
  if (chat.users.includes(userId)) {
    res.status(400);
    throw new Error("User is already in the group");
  }
  const added=await Chat.findByIdAndUpdate(
    chatId,
    {
      $push:{users:userId},
    },
    {
      new:true
    }
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if(!added){
    res.status(400);
    throw new Error("Chat Not Found");
  }else{
    res.json(added);
  }
});
export const removeFromGroup=expressAsyncHandler(async(req,res)=>{
  const {chatId,userId}=req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  
  if (!chat.users.includes(userId)) {
    res.status(400);
    throw new Error("User is not in the group");
  }

  const removed=await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull:{users:userId},
    },
    {
      new:true
    }
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if(!removed){
    res.status(400);
    throw new Error("Chat Not Found");
  }else{
    res.json(removed);
  }
})
