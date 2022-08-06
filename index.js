/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const db = require("./db");
const fileUpload = require("express-fileupload");
var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "sample",
  api_key: "874837483274837",
  api_secret: "a676b67565c6767a6767d6767f676fe1",
  secure: true,
});

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use("/api/user", require("./Backend/Routes/UserRoutes/User"));
app.use("/api/chat", require("./Backend/Routes/ChatRoutes/Chat"));
app.use(
  "/api/message",
  require("./Backend/Routes/MessageRoutes/MessageRoutes")
);

const port = 5000;
const server = app.listen(port, () =>
  console.log(`App listening on port:${port}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Socket is connected");

  socket.on("create_room", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected", userData._id);
  });

  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("User join room: ", room);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    // console.log(chat.users);
    // console.log(newMessageReceived);
    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("create_room", () => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});
