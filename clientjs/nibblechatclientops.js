//===========================================================================   
// Product : Nibble Chat
// technology : Node.js
// Author : Rahul Kumar Gupta (rahgup@yahoo.com)
// JS Description:
//  This file contains functions and socket messages which related to user 
//   operations
//
//=========================================================================== 
      // code for restricting back button, once person is logged.

     chatCKValue = readCK(chatCK);
     if(chatCKValue==null){
    	 window.location =chatUrl;
     }
 
      // code for loading the userlist and welcome page once user logins
  
     if(readCKValue(chatCK,2)==-1){
    	 
     	 createCK(chatCK,chatCKValue+",1",0);
     	 
         socket.emit("userLoggedIn", {
             "name": readCKValue(chatCK,1)
         });
 
         var uaname = readCKValue(chatCK,1);
         document.getElementById("usrName").value=uaname;
         document.title+= " - "+ uaname;
         // Welcome Message for User from sever
           socket.on("welcome", function (data) {
               //grab the element for which you've to add the the message from server
               var welcomeMsg = document.getElementById("welcomeMsg");
               //add the message recieved from server to the element
               welcomeMsg.innerHTML = data.msg;
               //populateUserList(data.users);
           });
           
           
     }
        

         
      // User Chat message receIved from sever
         socket.on("pvtMsg", function(data){
              //user who is sending message
              var usrName=document.getElementById("usrName").value;
              var msg="";
              var selfUser="false";
              var msgType="pvtMsg";

              if(usrName==data.name){
               // msg = ""+data.name +"[ "+data.to +" ]" +"  "+ "<i></i> " +data.msgTxt+ " " + data.dt;
                   msg= "<div class=\"talk-bubbleSelf pvtMsg\">";
               msg +="<div class=\"name nameshadow left-name\">"+data.name+"</div>";               
               msg +="<div class=\"dt dtshadow\">"+data.dt+"</div>";
               msg +="<div class=\"name nameshadow right-name\">Me</div>";
               msg +="<div class=\"talktext\"><span></span><p><i></i> " +data.msgTxt +"</p><span class=\"right-user\"></span></div></div>";

              }else {
               // msg = ""+data.name +" "+ "<i></i> " +data.msgTxt+ " " + data.dt;
               msg= "<div class=\"talk-bubbleSelf pvtMsg remove-arrow\">";
               msg +="<div class=\"name nameshadow\">"+data.name+"</div>";
               msg +="<div class=\"dt dtshadow\">"+data.dt+"</div>";
     
               msg +="<div class=\"talktext\"><span></span><p><i></i> " +data.msgTxt +"</p></div></div>";
               selfUser="true";

              }


              //publishMsgToChatArea(data.name,data.msgTxt,data.name,selfUser,msgType);

              publishToChatArea(msg);
          });

//------------------------------------------------------------------------           
//   When send button is clicked on, send the message to server
//------------------------------------------------------------------------          
         function sendUsrMsg(){
          	 if(validateMsg(chatCK,"msgTxt")==-1)
          		 return -1;
          	 
           	 var msgTxt = document.getElementById("msgTxt").value;
           	 document.getElementById("msgTxt").value="";  	
              //send to the server with person name and message
               var usrName=document.getElementById("usrName").value;

              socket.emit("userMsg", {
                  "name": usrName,
                  "msgTxt": msgTxt
              });
          }
          
//------------------------------------------------------------------------                       
//    When User loggedOut button is clicked on, send the message to server
//------------------------------------------------------------------------ 
            function logoutUsr(){
            		
                     if(confirm("You will logged out of Chat")){
               	  
                      var usrName=document.getElementById("usrName").value;
                	    emitLogoutMsg(usrName);
                        document.getElementById("usrName").value="";
                        eraseCK(chatCK);
                        window.location=chatUrl;  
                     }

                }       
                
//------------------------------------------------------------------------ 
//      When Admin sends  message to particular user
//------------------------------------------------------------------------ 
                function sendPvtMsg(){
                   sendMsgTo(chatCK,"msgTxt","pvtMsg","usrName");
                }
                

