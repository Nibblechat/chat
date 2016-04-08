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

// this statement is to ignore the certificate expire message while sending email.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var nodemailer = require('nodemailer');

var log = console.log; 

// global variables
var usrdir=".\\users\\";
var admdir=".\\admin\\";
const PORT = 8082;
var users = {};
var usersockets = {};
var userdetails={};
var adminUserSocket;
var adminUser;
var adminuserdetails;

//rooms which are currently available in chat
var rooms = ['EULT','EULT SCRUM','TUI TECH', 'TUI LT', 'TUI ALL'];

//listening to PORT
server.listen(PORT);


//sockets object isn't a member of the socket.io module itself, but of a listening instance of io.Manager().
log("Server running at " + PORT);



//create reusable transporter object using SMTP transport 
var fromEmailaddr = "Nibble Chat <rgupta89@sapient.com>";

/* var transporter = nodemailer.createTransport({
service: 'Gmail',
host:"smtp.gmail.com",
port: 465,
debug: true,
auth: {
   user: 'rahgup@gmail.com',
   pass: ''},
    tls: {
      ciphers: 'SSLv3'
    }
});
*/



//listening to http server
var io = socketio.listen(server);

// method to capture http request and http response
function handleHTTPRequest(req, res) {
    var dir = "/";

    var uri = url.parse(req.url).pathname;
    //log(req.method);
    switch (req.method) {

      case "POST":
    	  if (req.url == "/nibblechat.html") {
    		  //log("nibble chat....................");
    		  processSignup(res, req, dir, uri,"index.html", "CHAT");
          }
    	  else if(req.url == "/nimda.html") {
    		  //log("nimda....................");
    		  
    		 processSignup(res, req, dir, uri ,"nimdalogin.html","ADMIN");
    	  }
    	  else
    		 processFile(req, res, dir, uri);
         break;
      case "GET":
        if (uri == "/nibblechat/")
         {
           uri = "index.html";
         }
        else if (uri == "/nibblechat/admin/")
         {
           uri = "nimdalogin.html";
         }  
         processFile(req, res, dir, uri);
        
        break;
      default :
    	  resp.writeHead(404, "Resource Not Found", { "Content-Type": "text/html" });
          resp.write("<html><html><head><title>404</title></head><body>404: Resource not found. Go to <a href='/'>Home</a></body></html>");
          resp.end();
    	  break;
    }
	  

}

//Opening Websocket connection and listening to it.

io.sockets.on('connection', function (socket) {

  //when receiving the data from the client, push the same message to clients.
    socket.on("userMsg", function (data) {
    	//log("msg from user == " ,data);
        //send the data to the current client requested/sent.
        socket.emit("msg",{
            "name": data.name,
            "msgTxt": data.msgTxt,
            "dt" :getDate(),
            "fname" : userdetails[data.name].fName,
            "lname" : userdetails[data.name].lName,
            "email" : userdetails[data.name].email
        });
        
       // send the data to all the other clients
       // socket.broadcast.emit("msg", data);
        socket.broadcast.emit("msg",{
            "name": data.name,
            "msgTxt": data.msgTxt,
            "dt" :getDate(),
            "fname" : userdetails[data.name].fName,
            "lname" : userdetails[data.name].lName,
            "email" : userdetails[data.name].email
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
    	//log(data);
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
    // user registration message
    
    
    socket.on('userRegister', function(data) {  
       log("userRegister" + data);	
       
       // creating user specific file.
       var file =usrdir+data.usrName+".json";	
       
        log("filename = "+ file);
       //Check for file existence.
       fs.exists(file, function(exists) {
    	    if (exists) {
    	        //log("yes file exisits");
    	        socket.emit("userExists",{
    	            "msgTxt" : "user Already Exists", 
    	            "name" : data.usrName
    	        });  
    	    } 
    	    else {
    	        // preparing JSON Structure
    	        var record = {
    	                 "usrName" :  data.usrName,  
    	                 "fName" :    data.fName,
    	                 "lName":    data.lName,
    	                 "gender":   data.gender, 
    	                 "dob" : data.dob,
    	                 "addr1":   data.addr1, 
    	                 "addr2":   data.addr2,
    	                 "city" :   data.city,
    	                 "state" :  data.state, 
    	                 "country":   data.country, 
    	                 "pincode":   data.pincode, 
    	                 "mobile":  data.mobile,  
    	                 "email":  data.email, 
    	                 "password":  data.password
    	              }; 
    	          // writing file.
    	        
    	       	 fs.writeFile(file, JSON.stringify(record, null, 4), function(err) {
    	     	  if(err) {
    	     	    log(err);
    	     	    } else {
    	     	    	log("User registered = " + file);
    	     	    }
    	     	  });

    	    }
    	});
       
    });
    
    
    // Private message is sent from a user for particular user or from Admin to particular user
    socket.on('pvtMsg', function(data) {
    	sendPvtMessage(data,socket,"PVTMSG");
    });
  
   
    
    // when  the user  loggedin / loggedout then  user details  details from the client, push the same message to clients.
    socket.on("userLoggedIn", function (data) {
     	//log("log in " + data.name);

        // Store a reference of client socket ID
        users[data.name] = socket.id;    
       // Storing a reference to client  socket
        usersockets[socket.id] = { username : data.name, socket : socket };  
        
       // storing userDetails
        userdetails[data.name]=getUserDetails(data.name,"CHAT");
        
        //log ("user details = ", userdetails[data.name]);
        //send the user data to the current client requested/sent.
        socket.emit("userList",{
            "name": data.name,
            "msg": " logged in",
            "dt" :getDate(),
            "users": users,
            "userdetails": userdetails,
            "fname" : userdetails[data.name].fName,
            "lname" : userdetails[data.name].lName,
            "email" : userdetails[data.name].email
        });
        
       // send the welcome data to  to the current client requested/sent.
        socket.emit("welcome",{
            "name": data.name,
            "msg": " Welcome "+ userdetails[data.name].fName + " "+userdetails[data.name].lName,
            "dt" :getDate(),
            "fname" : userdetails[data.name].fName,
            "lname" : userdetails[data.name].lName,
            "email" : userdetails[data.name].email
        });
            
       // send the user data to all the other clients
       socket.broadcast.emit("userList",{
           "name": data.name,
           "msg": " logged in",
           "dt" :getDate(),
           "users": users,
           "userdetails": userdetails,
           "fname" : userdetails[data.name].fName,
           "lname" : userdetails[data.name].lName,
           "email" : userdetails[data.name].email           
       });
       
  
      });
    

    // when  the user  logged-out then  user details  details from the client, push the same message to clients.
   
    socket.on("userLoggedOut", function (data) {
     	//log(data);
        
        // send the logged out data  to the current client requested/sent.
        socket.emit("userLoggedOut",{
            "name": data.name,
            "msgTxt": " logged out",
            "logoutType" :"self",            
            "dt" :getDate(),
            "fname" : userdetails[data.name].fName,
            "lname" : userdetails[data.name].lName,
            "email" : userdetails[data.name].email
        });
        
        
        // send the logged out "welcome message"  data  to the current client requested/sent.
        socket.emit("welcome",{
            "name": data.name,
            "msg": " Thank you "+ data.name + " for using Nibble Chat",
            "dt" :getDate(),
            "fname" : userdetails[data.name].fName,
            "lname" : userdetails[data.name].lName,
            "email" : userdetails[data.name].email
        });
        
      // send the data to all the other clients
       socket.broadcast.emit("userLoggedOut",{
           "name": data.name,
           "msgTxt": " logged out",
           "logoutType" :"self",            
           "dt" :getDate(),
           "fname" : userdetails[data.name].fName,
           "lname" : userdetails[data.name].lName,
           "email" : userdetails[data.name].email
       });

        //deleting objects created for each users.
       var usrsock = users[data.name];

       delete users[data.name];
       delete usersockets[usrsock];
       delete userdetails[data.name];
       
       //log("---------------------------REMOVING OBJECT-----------------------");
       //log(users);
       //log(usersockets);
       //log(userdetails);
       //log("---------------------------REMOVING OBJECT-----------------------");
       
       
       // closing socket connection
       socket.disconnect();
      });

 
 //--------------------- ADMIN SOCKET MESSAGE------------------------------------
    

    // when  the admin user  logged-in / logged-out then  user details  details from the client, push the same message to clients.
    socket.on("userAdmLoggedIn", function (data) {
     	//log("ADMIN log in " + data.name);
        
        // adminUser
        adminUser=socket.id;
        adminUserSocket= { username : data.name, socket : socket }; 
        
       // storing userDetails
       adminuserdetails=getUserDetails(data.name,"ADMIN");
        
       // send the welcome data to  to the current client requested/sent.
        socket.emit("welcomeAdm",{
            "name": data.name,
            "msg": " Welcome "+ adminuserdetails.fName + " "+adminuserdetails.lName,
            "dt" :getDate(),
            "users": users,
            "userdetails": userdetails,
            "fname" : adminuserdetails.fName,
            "lname" : adminuserdetails.lName,
            "email" : adminuserdetails.email 
        });
 //       log("all users " + users);
      });
    
    
    //========================================================================
    // when  the Admin  logged-out then  user details  details from the client,
    // push the same message to clients.
    //=========================================================================
    socket.on("userAdmLoggedOut", function (data) {
     	//log(data);
        
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
      
       //log("---------------------------REMOVING ADMIN OBJECT-----------------------");
       //log(adminUser);
       //log(adminUserSocket);       
       //log("---------------------------REMOVING ADMIN OBJECT-----------------------");
       
       // closing socket connection
       socket.disconnect();
      });

    //========================================================================
    // when  the Admin  forcibly logout some users
    //========================================================================
  
    socket.on("forcedLogout", function (data) {
    	//log("forcedLogout ==== " + data);
        
        // send the logged out data  to the current client requested/sent.
        socket.emit("userLoggedOut",{
            "name": data.to,
            "msgTxt": " forced logged out",
            "logoutType" :"forced",            
            "dt" :getDate(),
            "fname" : adminuserdetails.fName,
            "lname" : adminuserdetails.lName,
            "email" : adminuserdetails.email,
            "tofname" : userdetails[data.to].fName,
            "tolname" : userdetails[data.to].lName,
            "toemail" : userdetails[data.to].email
        });
        
        
      // send the data to all the other clients
       socket.broadcast.emit("userLoggedOut",{
           "name": data.to,
           "msgTxt": " logged out",
           "logoutType" :"forced",
           "dt" :getDate(),
           "fname" : userdetails[data.to].fName,
           "lname" : userdetails[data.to].lName,
           "email" : userdetails[data.to].email,
           "tofname" : userdetails[data.to].fName,
           "tolname" : userdetails[data.to].lName,
           "toemail" : userdetails[data.to].email
       });

        //deleting objects created for each users.
       var usrsock = users[data.to];

       delete users[data.to];
       delete usersockets[usrsock];
       delete userdetails[data.to];
       
       //log("---------------------------REMOVING OBJECT-----------------------");
       //log(users);
       //log(usersockets);
       //log("---------------------------REMOVING OBJECT-----------------------");
       
       // closing socket connection
       //usrsock.disconnect();
      });    

    //========================================================================
    // event when user or admin send a email to users
    //========================================================================
    socket.on("emailMsg", function (data) {
        //send mail with defined transport object 

    	   var fname;
    	   var lname;
    	   var email;
    	   var signatureFooter="</br></br><b><i> This mail is generated through NIBBLE CHAT</i></b>";
     	   var fromEmail;
     	   var toEmail;
     	   var subjectText = "Mail From Nibble Chat";
     	   var stIndex=data.msgTxt.toUpperCase().indexOf("SUBJECT[");
     	   var endIndex;
     	   var bodyText=data.msgTxt;

     	   
    	   //log("email Msg +++++ pageType = [%s]=== ",data.pageType);
     	   
     	   // parsing Subject line and Body text
     	    if(stIndex > -1) {
     	    	endIndex=data.msgTxt.indexOf("]");
     	    	if(endIndex > -1) {
     	    	  subjectText=bodyText.substring(stIndex+8,endIndex);
     	    	  bodyText= bodyText.substring(endIndex+1);
     	    	}
     	    }

     	    
    	   if(data.pageType=="ADMIN"){
    	       fname=adminuserdetails.fName;
    	       lname=adminuserdetails.lName;
    	       email=adminuserdetails.email;
    	       bodyText+="</br></br> Thanks and Regards </br> Administrator </br> <b>Nibble Chat team</b>";
    	       subjectText+="[From Administrator]";
    	   }else{
    	       fname=userdetails[data.name].fName;
    	       lname=userdetails[data.name].lName;
    	       email=userdetails[data.name].email;  
               subjectText+="[From "+fname + " "+ lname+ "]";
    	   }
    	   
    	   
 	   //fromEmail=fname + " "+ lname+ "<"+email+">";
	   fromEmail=fromEmailaddr; 
 	   toEmail=userdetails[data.to].email;
           bodyText = bodyText+"<br/>"+fname + " "+ lname+ "("+email+") <br/>"+ signatureFooter;


 	    
       //setup e-mail data with unicode symbols 
        var mailOptions = {
         from: fromEmail,  
         to: toEmail, //data.to, // list of receivers 
         subject: subjectText, // Subject line 
         
         //text: data.msgTxt, // plaintext body 

         html: bodyText // html body 
         };
 	     //log("transporter" +transporter);
        transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return log(error);
          }
           //log('Message sent: ' + info.response);
           sendPvtMessage(data,socket,"EMAIL");
         });
     })
     
   });

//-------------------------------------------------------------------------------------------
//           GENERIC FUNCTIONS
//-------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------
//   DATE FORMATING FUNCTIONS
//-------------------------------------------------------------------------------------------

function getDate(){
	return new Date().toLocaleString(). replace(/GMT/, ' '). replace(/\..+/, '');     
} 


//-------------------------------------------------------------------------------------------
// RENDERING 404 PAGE
//-------------------------------------------------------------------------------------------

function get404(req, resp) {
    resp.writeHead(404, "Resource Not Found", { "Content-Type": "text/html" });
    resp.write("<html><html><head><title>404</title></head><body>404: Resource not found. Go to <a href='/'>Home</a></body></html>");
    resp.end();
}

//-------------------------------------------------------------------------------------------
//RENDERING 405 PAGE
//-------------------------------------------------------------------------------------------


function get405(req, resp) {
    resp.writeHead(405, "Method not supported", { "Content-Type": "text/html" });
    resp.write("<html><html><head><title>405</title></head><body>405: Method not supported</body></html>");
    resp.end();
}


//-------------------------------------------------------------------------------------------
//  lOGIC TO RENDER STATIC FILES
//-------------------------------------------------------------------------------------------

function processFile(req, res, dir, uri){
	var filename = path.join(dir, uri);
    //log("file :", filename);
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

//-------------------------------------------------------------------------------------------
//Generic function to process sign request for both User and Admin consoles 
//which calls processSignInRequest method
//-------------------------------------------------------------------------------------------


function processSignup(res, req, dir, oriuri, uri, pageType){
  var POST = {}; 
  var body="";
   req.on('data', function(data) {
  if (body.length > 1e6) { 
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      request.connection.destroy();
  }
  
  //log(" uri [%s] , pageType [%s]", uri, pageType);
  data = data.toString();
  data = data.split('&');
  for (var i = 0; i < data.length; i++) {
      var _data = data[i].split("=");
      POST[_data[0]] = _data[1];
      
  }
  //log(POST);
  var status = processSignInRequest(POST, pageType);
  //log("status = ", status);
  if(status== -1){
      res.statusCode = 302; 
      res.setHeader("Location", uri);
      res.setHeader("errorCode","NOUSER");
      processFile(req, res, dir, uri);
 }
  else if (status== -2) {
      res.statusCode = 302; 
      res.setHeader("Location", uri);
      res.setHeader("errorCode","IDPWDMISMATCH");
      processFile(req, res, dir, uri);
   } else {
  	 processFile(req, res, dir, oriuri);
   } 
    
  });
}


//-------------------------------------------------------------------------------------------
//Generic function to process sign request for both User and Admin consoles
//-------------------------------------------------------------------------------------------

function processSignInRequest(POST,pageType){
	
	var usrName;
	var pwd;
	var dir;

	// creating user specific file.

     var file ;	
    
     if(pageType=="ADMIN"){
    	dir=admdir;
    	usrName=POST.usrAdmName;
    	pwd=POST.usrAdmPwd;
	   
     } else {
     	dir=usrdir;
    	usrName=POST.usrName;
    	pwd=POST.usrPwd;
     }
     
     file =dir+usrName+".json";
    // log("file = [%s] , usrName =[%s],  pwd =[%s], pageType =[%s] ", file, usrName, pwd, pageType);
     var exists = fs.existsSync(file);
    
	  if (exists) {
			var filecontent = fs.readFileSync(file, null);
			var jsonContent;
			jsonContent=JSON.parse(filecontent);
		  if(jsonContent.usrName==usrName
			 && jsonContent.password==pwd)  {
		//	   log ("login successful");
			   return 0;
			  }else{
			//	log ("login unsuccessful");
			  return -2;
			}
	  } else {
		  log ("user doesn't exists", usrName);
	     return -1;
	  }
 	  
}

//-------------------------------------------------------------------------------------------
//Generic function to reteive user details
//-------------------------------------------------------------------------------------------


function getUserDetails(usrName,pageType){
	var dir;
    var file ;	
    
     if(pageType=="ADMIN"){
    	dir=admdir;
   
     } else {
     	dir=usrdir;
     }
     
     file =dir+usrName+".json";

	var filecontent = fs.readFileSync(file, null);
	return JSON.parse(filecontent);
}


//-------------------------------------------------------------------------------------------
//Generic function send private Messages and email to users
// 1. from user to user
// 2. from admin to user
//-------------------------------------------------------------------------------------------

function sendPvtMessage(data,socket,msgType){

    // Lookup the socket of the user for  private message to be send
	
   var pvtSocketId=users[data.to];
   var fname;
   var lname;
   var email;
   var msgTxt= data.msgTxt;
   var toMsgTxt=data.msgTxt;
   
   //log("pageType = [%s]=== msgType = [%s] =====",data.pageType,msgType );
   
   if(data.pageType=="ADMIN"){
       fname=adminuserdetails.fName;
       lname=adminuserdetails.lName;
       email=adminuserdetails.email;
  
   }else{
       fname=userdetails[data.name].fName;
       lname=userdetails[data.name].lName;
       email=userdetails[data.name].email;  
   }
   
   // initimation to sender and recieved as private mesage for email
   
   if(msgType=="EMAIL") {
	   toMsgTxt= "You have mail from " +fname + " " +lname;
	   msgTxt= "Mail Send to " + userdetails[data.to].fName + " " +userdetails[data.to].lName;
   }
   
   // send message to targeted user
   
    io.to(pvtSocketId).emit('pvtMsg', { 
             "msgTxt" : toMsgTxt, 
             "name" : data.name,
             "to" : data.to,
             "dt" :getDate(),
             "fname" : fname,
             "lname" : lname,
             "email" : email,
             "tofname" : userdetails[data.to].fName,
             "tolname" : userdetails[data.to].lName,
             "toemail" : userdetails[data.to].email
        });
    
    //send the user notification  to the current client requested/sent.
    socket.emit("pvtMsg",{
        "msgTxt" : msgTxt, 
        "name" : data.name,
        "to" : data.to,
        "dt" :getDate(),
        "fname" : fname,
        "lname" : lname,
        "email" : email,
        "tofname" : userdetails[data.to].fName,
        "tolname" : userdetails[data.to].lName,
        "toemail" : userdetails[data.to].email
    });
}