//THE SERVER SIDE:
//Initialization (express, public, http, port,socket.io)
//listen for user connection 
//listen for message sent from the user
//Send that message to other users
//listen for user disconnection

/////////////////////////////////////////////////////////////////

//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));



//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);

//connect to ports
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});


//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

/////////////////////////////////////////////////////////////////


//Listen for individual users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'data' from this client
    socket.on('data', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received data:" + JSON.stringify(data));

        //Send the data to all clients, including this one
        //Set the name of the message to be 'data'
        //Send the data  to all clients
        io.sockets.emit('data', data);

        // ------------------other options---------------------------------------------
        //Send the data to all other clients, not including this one
        // socket.broadcast.emit('data', data);

        //Send the data to just this client
        // socket.emit('data', data);
    });



    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});