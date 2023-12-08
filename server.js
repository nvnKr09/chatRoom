// require is a way of importing.
const express = require('express');  // getting this express from node_modules
// express is a function that returns a server

const http = require('http');  // gettting from nodeJS
const socketIo = require('socket.io');  // this gives me Object that has srver class
const SocketServer = socketIo.Server;   // saving that server class in my socket.Io
// this socketServer will create my IO

const PORT = 5500;

const expressServer = express();  // i have my server in app variable.
// i need to modify my expressServer to http server
const httpServer = http.createServer(expressServer);
 
const io = new SocketServer(httpServer);  // this class requires a server to create an IO 
                                          // that is associated with IO, this only accepts http Server

io.on("connection", (socket) => {
    console.log(`user connected with ID: ${socket.id}`);
    // 1
    socket.on('this is a msg event', (data) => {
        io.emit('this is a msg event', data);
    });
    // 2
    socket.on('username enter', (data) => {
        io.emit('username enter', data);
    });
    // 3
    socket.on('username exit', (data) => {
        io.emit('username exit', data);
    });
});    

expressServer.use(express.static("public"));

httpServer.listen(PORT, ()=> {
    console.log(`app is up & running on http://localhost:${PORT}/`);
})