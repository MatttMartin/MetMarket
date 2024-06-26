const express = require("express");
const { Application, Request, Response } = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require('dotenv');


const app = express();
app.use(cors());
app.use(express.static('public'));

//increasing the limit for image upload
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


dotenv.config();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const profileRoutes = require('./endpoints/profile'); 
const messagesRoutes = require('./endpoints/messages');
const postingRoutes = require('./endpoints/posts');
const categoryRoutes = require('./endpoints/categories');
const adminRoutes = require('./endpoints/admin');
const cloudinaryRoutes = require('./endpoints/cloudinary');
const locationRoutes = require('./endpoints/location');
const reportRoutes = require('./endpoints/reports');

app.use('/api/profile', profileRoutes); 
app.use('/api/messages', messagesRoutes); 
app.use('/api/ads', postingRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/report', reportRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


io.on("connection", (socket) => {
  console.log("New client is connected"); 

  const userId = socket.handshake.query.userId;
  //join a group based on the userid
  socket.join(userId)

  //when a user sends a message, emit it to the other user in the conversation
  socket.on("message", (msg) => {
    io.to(msg.receiver_id).emit("newMessage", msg)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


try {
  server.listen(PORT, () => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error) {
  console.error(`Error occurred: ${error.message}`);
}

