import express from "express";
import { chats } from "./Data/Data.js";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import connectDB from "./config/db.js"; // Import DB connection
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import {Server} from "socket.io";
import http from "http";
import { log } from "console";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);

app.use('/api/chats',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound)
app.use(errorHandler)
// Global Error Handler (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start the Server
// app.listen(PORT, () =>
//   console.log(`Server is listening on port ${PORT}`.yellow.bold)
// );
const server=http.createServer(app);
const io=new Server(server,{
  pingTimeout:60000,
  cors:{
    origin:["http://localhost:5173", "*"],
    methods:["GET","POST","PUT"]
  }
});

io.on("connection",(socket)=>{
  console.log(`User connected: ${socket.id}`);

  socket.on("setup",(userData)=>{
    if (!userData || !userData._id) {
      console.log("Invalid userData received");
      return;
    }
    socket.join(userData._id);
    console.log("userData",userData._id);
    // we are using user._id created by MongoDB for socket connection
    
    socket.emit("connected");
  });

  // using chat._id as room name
  socket.on("joinRoom",(room)=>{
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    
  });
  // joinRoom means user has opened current chat

  socket.on("sendMessage",(newMessageRecieved)=>{
    const chat =newMessageRecieved.chat;
    console.log("sendMessage",newMessageRecieved);
    
    if(!chat.users) return console.log("Chat.Users not defined");

    chat.users.forEach(user=>{
      if(user._id=== newMessageRecieved.sender._id) return;
      console.log("message recieved ",user._id);
      
      socket.in(user._id).emit("sendMessage",newMessageRecieved);
    })
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("Typing"); // Send event to all except sender
  });
  
  socket.on("stopTyping", (room) => {
    socket.to(room).emit("StopTyping");
  });

  socket.on("disconnect",()=>{
    console.log(`User disconnected : ${socket.id}`);
    
  });
  
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`.yellow.bold));



