const express = require("express");
const socket = require("socket.io");
const app = express();

//setting up server
let server = app.listen((process.env.PORT||7000), function () {
  console.log("Server is running");
});
//using app
app.use(express.static("public"));

//socket.io with express
let io = socket(server);


io.on("connection", function (socket) {
  console.log("User Connected :" + socket.id);

//create room and join
  socket.on("join", function (roomName) {
    let rooms = io.sockets.adapter.rooms;
    let room = rooms.get(roomName);

    if (room == undefined) {
      socket.join(roomName);
      socket.emit("created");
    } else if (room.size == 1) {
      socket.join(roomName);
      socket.emit("joined");
    } else {
      socket.emit("full");
    }
    console.log(rooms);
  });
 //to broadcast the name of each participant excluding the user joined
  socket.on("ready", function (roomName) {
    socket.broadcast.to(roomName).emit("ready"); 
  });


  socket.on("candidate", function (candidate, roomName) {
    console.log(candidate);
    socket.broadcast.to(roomName).emit("candidate", candidate); 
  });

 
//create offer
  socket.on("offer", function (offer, roomName) {
    socket.broadcast.to(roomName).emit("offer", offer); 
  });

 
//for answering the call
  socket.on("answer", function (answer, roomName) {
    socket.broadcast.to(roomName).emit("answer", answer); 
  });
});
