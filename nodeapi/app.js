const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }, path: "/socket"
});

require('dotenv').config({path: './app/config/.env'});

// const middleware = require('./app/middleware/payloadHandler');

app.use(function(req, res, next) {
    res.header({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Max-Age': '3600',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Auth-User',
    })
    next();
});

app.use(express.urlencoded({extended: true}));
// Accepts Raw Text
app.use(express.text());
// Filters Encrypted Req.body
// app.use(middleware.decryptPayload);
// For Returning JSON Payload
app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Authenticate Users
const auth = require('./app/middleware/auth');

const classlist = require('./app/routes/getclasslist.routes.js')

app.use('/api', classlist);

app.get('/', (req, res)=>{
    res.json({message: 'Connected to Server'})
})

io.on('connection', socket => {
    // console.log('user with ', socket, 'connected');
       // When someone attempts to join the room
    socket.on('join-room', (roomId, peerId, name, id) => {
        console.log(roomId)
        socket.join(roomId);  // Join the room
        socket.broadcast.to(roomId).emit('user-connected', name, peerId, id); // Tell everyone else in the room that we joined
        
        // Communicate the disconnection
        // To listen for a client's disconnection from server and intimate other clients about the same
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected');
        })

        socket.on('leave-room', () => {
            socket.leave(roomId);
        })
        // when someone has to chat from the chat box
        socket.on('chat', (content, sender, time, username) => {
            console.log('NEW MESSAGE: ', content, username)
            socket.broadcast.to(roomId).emit('new-message', content, sender, time, username); 
        })
        socket.on('share-screen', (userId) => {
            socket.broadcast.to(roomId).emit('user-sharescreen', userId);
        })
        socket.on('stop-sharing', (message) => {
            socket.broadcast.to(roomId).emit('sharing-stopped', message);
        })

        socket.on('participants', (participants) => {
            socket.broadcast.to(roomId).emit('participants', participants);
        })
    })
    


});
const port = 4230;
server.listen(port, () => console.log('listening on port' + port));