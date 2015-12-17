// Load the http module to create an http server.
var http = require('http');
//Load the fs module for file operations.
var fs = require('fs');

// Configure our HTTP server to respond with Hello World to all requests (handleRequest).
var server = http.createServer(handleHTTPRequest); 
//Load the websocket module for websocket I/O.
var socketio = require('socket.io');

var url = require("url");
var path = require('path');
var mime = require('mime');

var log = console.log; 

// global variables
const PORT = 8082;
var users = {};
var usersockets = {};
var adminUserSocket;
var adminUser;

//rooms which are currently available in chat
var rooms = ['EULT','EULT SCRUM','TUI TECH', 'TUI LT', 'TUI ALL'];

//listening to PORT
server.listen(PORT);


//sockets object isn't a member of the socket.io module itself, but of a listening instance of io.Manager().
log("Server running at " + PORT);

//listening to http server
var io = socketio.listen(server);

function getDate(){
	return new Date().toLocaleString(). replace(/GMT/, ' '). replace(/\..+/, '');     
} 
// method to capture http request and http response
function handleHTTPRequest(req, res) {
	
    var dir = "/";
    var uri = url.parse(req.url).pathname;
    if (uri == "/nibblechat/")
    {
        uri = "index.html";
    }
    if (uri == "/nibblechat/admin/")
    {
        uri = "nimdalogin.html";
    }   
    var filename = path.join(dir, uri);
 //   log(filename);
  //  log(mime.lookup(filename));
    
    fs.readFile(__dirname + filename,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.setHeader('content-type', mime.lookup(filename));
            res.writeHead(200);
            res.end(data);
        });
}

//Opening Websocket connection and listening to it.

io.sockets.on('connection', function (socket) {

  //when receiving the data from the client, push the same message to clients.
    socket.on("userMsg", function (data) {
    	log(data);
        //send the data to the current client requested/sent.
        socket.emit("msg",{
            "name": data.name,
            "msgTxt": data.msgTxt,
            "dt" :getDate()
        });
        
       // send the data to all the other clients
       // socket.broadcast.emit("msg", data);
        socket.broadcast.emit("msg",{
            "name": data.name,
            "msgTxt": data.msgTxt,
            "dt" :getDate()
        });
        // sending message to Admin also   
       // io.to(adminUser).emit("msg",{
       //     "name": data.name,
       //     "msgTxt": data.msgTxt,
       //     "dt" :getDate()
      //  });
        
    });
   // -----------------------------  COMMON  SOCKET MESSAGE  ----------------------   
    
    // sending News Message to all the clients.
	 
    socket.on("news", function (data) {
    	log(data);
        //send the data to the current client requested/sent.
        socket.emit("news",{
        	"name" : data.name,
            "msgTxt": data.msgTxt,
            "dt" :getDate()
        });    	
        //send the data to the all users.
        socket.broadcast.emit("news",{
        	"name" : data.name,
            "msgTxt": data.msgTxt,
            "dt" :getDate()
        });
    });
    
  //--------------------- USERS SOCKET MESSAGE------------------------------------
    
    
    // Private message is sent from a user for particular user or from Admin to particular user
    socket.on('pvtMsg', function(data) {
        // Lookup the socket of the user for  private message to be send
    	
    	var pvtSocketId=users[data.to];
       
        io.to(pvtSocketId).emit('pvtMsg', { 
                 "msgTxt" : data.msgTxt, 
                 "name" : data.name,
                 "to" : data.to,
                 "dt" :getDate()
            });
        
        //send the user data to the current client requested/sent.
        socket.emit("pvtMsg",{
            "msgTxt" : data.msgTxt, 
            "name" : data.name,
            "to" : data.to,
            "dt" :getDate()
        });
        
    });
  
   
    
    // when  the user  loggedin / loggedout then  user details  details from the client, push the same message to clients.
    socket.on("userLoggedIn", function (data) {
     	log("log in " + data.name);

        // Store a reference of client socket ID
        users[data.name] = socket.id;    
       // Storing a reference to client  socket
        usersockets[socket.id] = { username : data.name, socket : socket };  

        //send the user data to the current client requested/sent.
        socket.emit("userList",{
            "name": data.name,
            "msg": data.name + " logged in",
            "dt" :getDate(),
            "users": users
        });
        
       // send the welcome data to  to the current client requested/sent.
        socket.emit("welcome",{
            "name": data.name,
            "msg": " Welcome "+ data.name,
            "dt" :getDate()
        });
            
       // send the user data to all the other clients
       socket.broadcast.emit("userList",{
           "name": data.name,
           "msg": data.name + " logged in",
           "dt" :getDate(),
           "users": users
       });
       
  
      });
    

    // when  the user  logged-out then  user details  details from the client, push the same message to clients.
   
    socket.on("userLoggedOut", function (data) {
     	log(data);
        
        // send the logged out data  to the current client requested/sent.
        socket.emit("userLoggedOut",{
            "name": data.name,
            "msgTxt": data.name + " logged out",
            "logoutType" :"self",            
            "dt" :getDate()
        });
        
        
        // send the logged out "welcome message"  data  to the current client requested/sent.
        socket.emit("welcome",{
            "name": data.name,
            "msg": " Thank you "+ data.name + " for using Nibble Chat",
            "dt" :getDate()
        });
        
      // send the data to all the other clients
       socket.broadcast.emit("userLoggedOut",{
           "name": data.name,
           "msgTxt": data.name + " logged out",
           "logoutType" :"self",            
           "dt" :getDate()
       });

        //deleting objects created for each users.
       var usrsock = users[data.name];

       delete users[data.name];
       delete usersockets[usrsock];
       log("---------------------------REMOVING OBJECT-----------------------");
       log(users);
       log(usersockets);
       log("---------------------------REMOVING OBJECT-----------------------");
       // closing socket connection
       socket.disconnect();
      });

 
 //--------------------- ADMIN SOCKET MESSAGE------------------------------------
    

    // when  the admin user  logged-in / logged-out then  user details  details from the client, push the same message to clients.
    socket.on("userAdmLoggedIn", function (data) {
     	log("ADMIN log in " + data.name);
 
        // Store a reference of client socket ID
       // users[data.name] = socket.id;    
       // Storing a reference to client  socket
      //  usersockets[socket.id] = { username : data.name, socket : socket };  
        
        // adminUser
        adminUser=socket.id;
        adminUserSocket= { username : data.name, socket : socket }; 
        
       // send the welcome data to  to the current client requested/sent.
        socket.emit("welcomeAdm",{
            "name": data.name,
            "msg": " Welcome "+ data.name,
            "dt" :getDate(),
            "users": users
        });
        log("all users " + users);
      });
    
    
    
    // when  the Admin  logged-out then  user details  details from the client, push the same message to clients.
    
    socket.on("userAdmLoggedOut", function (data) {
     	log(data);
        
        // send the logged out "welcome msg"  data  to the current client requested/sent.
        socket.emit("welcomeAdm",{
            "name": data.name,
            "msg": " Thank you "+ data.name + " for using Nibble Chat",
            "dt" :getDate()
        });

        //deleting objects created for each users.
       var usrsock = users[data.name];

       //delete users[data.name];
      // delete usersockets[usrsock];
       delete adminUser;
       delete adminUserSocket; 
       log("---------------------------REMOVING ADMIN OBJECT-----------------------");
       log(users);
       log(usersockets);
       log(adminUser);
       log(adminUserSocket);       
       log("---------------------------REMOVING ADMIN OBJECT-----------------------");
       // closing socket connection
       socket.disconnect();
      });
    
 // when  the Admin  forcibly logout some users
    
    socket.on("forcedLogout", function (data) {
    	log("forcedLogout ==== " + data);
        
        // send the logged out data  to the current client requested/sent.
        socket.emit("userLoggedOut",{
            "name": data.to,
            "msgTxt": data.name+ "["+data.to+"]" + " forced logged out",
            "logoutType" :"forced",            
            "dt" :getDate()
        });
        
        
      // send the data to all the other clients
       socket.broadcast.emit("userLoggedOut",{
           "name": data.to,
           "msgTxt": data.to + " logged out",
           "logoutType" :"forced",
           "dt" :getDate()
       });

        //deleting objects created for each users.
       var usrsock = users[data.to];

       delete users[data.to];
       delete usersockets[usrsock];
       log("---------------------------REMOVING OBJECT-----------------------");
       log(users);
       log(usersockets);
       log("---------------------------REMOVING OBJECT-----------------------");
       // closing socket connection
       //usrsock.disconnect();
      });    
    
  });
