//===========================================================================   
// Product : Nibble Chat
// technology : Node.js
// Author : Rahul Kumar Gupta (rahgup@yahoo.com)
// JS Description:
// This file contains functions and socket messages which is  related to  
// ADMIN User operations
//
//=========================================================================== 
       // code for restricting back button, once admin is logged.    

     adminCKValue = readCK(adminCK);
     if(adminCKValue==null){
    	 window.location =adminUrl;
     }
 
     // code for loading the userlist and welcome page once user logins

     if(readCKValue(adminCK,2)==-1){
     	 createCK(adminCK,adminCKValue+",1",0);
     	 
         socket.emit("userAdmLoggedIn", {
             "name": readCKValue(adminCK,1)
         });
 
         var uaname = readCKValue(adminCK,1);
 
         document.getElementById("usrAdmName").value=uaname;
         document.title+= " - "+ uaname;
         // Welcome Message for User from sever
         
        socket.on("welcomeAdm", function (data) {
            //grab the element for which you've to add the the message from server
            var welcomeAdmMsg = document.getElementById("welcomeAdmMsg");
            //add the message received from server to the element
            welcomeAdmMsg.innerHTML = data.msg;
            populateUserList(data.users);

        });
        
       
     }
        
     // User Chat message received from sever
        socket.on("pvtMsg", function(data){
             //user who is sending message
             var msg = ""+data.name +"[ "+data.to +" ]" +"  "+ "<i></i> " +data.msgTxt+ " " + data.dt;
   
             publishToChatArea(msg);
         });


//------------------------------------------------------------------------  
//        When Admin clicks logged in button is clicked on, send 
//        the message to server
//------------------------------------------------------------------------  
         
         
         function logoutAdmUsr(){
 
        	 if(confirm("You will logged out of Chat")){
                 var usrAdmName =document.getElementById("usrAdmName").value;
                 socket.emit("userAdmLoggedOut", {
                     "name": usrAdmName
                 });
                 document.getElementById("usrAdmName").value="";
                 eraseCK(adminCK);
                 window.location=adminUrl;
              }
        	 

         }   
         
//------------------------------------------------------------------------  
//        function which will called when Admin forcefully 
//        logged out particular user
//------------------------------------------------------------------------  
         
         function forcedLoggedOut(){
    	     var toUsrName=document.getElementById("users");
             var selIdx= toUsrName.selectedIndex;
             
          	 if(selIdx==-1)
          	 {
          		 alert("Please selected the user");
          		 return 0;
          	 }
          	 
              // User to whom message is to be sent        	 
               var touser = toUsrName.options[selIdx].value;
              
                //user who is sending message
               var usrName=document.getElementById("usrAdmName").value;
               
               // message that needs to be sent
               
              document.getElementById("msgTxt").value="";
              socket.emit("forcedLogout", {
                  "name": usrName,
                  "to" :touser 
              });
         }
         
         
//------------------------------------------------------------------------        
//       When send button is clicked on, send the message to server
//------------------------------------------------------------------------  
         
         function broadcastMsg(){

          	 if(validateMsg(adminCK,"msgTxt")==-1)
          		 return -1;
          	 
           	 var msgTxt = document.getElementById("msgTxt").value;
           	 document.getElementById("msgTxt").value="";            	
              //send to the server with person name and message
             var usrName=document.getElementById("usrAdmName").value;

              socket.emit("news", {
                  "name": usrName,
                  "msgTxt": msgTxt
              });
          }
          
          
//------------------------------------------------------------------------      
//       When Admin sends  message to particular user
//------------------------------------------------------------------------  

       
          function sendAdmPvtMsg(){
             sendMsgTo(adminCK,"msgTxt","pvtMsg","usrAdmName");
          }
