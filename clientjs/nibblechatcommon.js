//===========================================================================   
// Product : Nibble Chat
// technology : Node.js
// Author : Rahul Kumar Gupta (rahgup@yahoo.com)
// JS Description:
//  This file contains functions and socket messages which are for both  
//  user and ADMIN User operations
//
//=========================================================================== 


  
 // ++++++++  RECEIVEING MESSAGES FROM SERVER(OTHER USERS/ADMIN)  ++++++
    
    //============================================
    // news from Admin
    //============================================
    
    socket.on("news", function (data) {
        //grab the element for which you've to add the the message from server
        var serverMsg = document.getElementById("serverMsg");
        //add the message receIved from server to the element
        //serverMsg.innerHTML = data.msgTxt  + " " + data.dt+" " + serverMsg.innerHTML ;
        var svrmsg="<div class=\"serverMsg\"><div class=\"dateTime\">" +data.dt  + "</div>";
            svrmsg+="<div class=\"msg\">"+data.msgTxt+"</div></div>";
            serverMsg.innerHTML = svrmsg + serverMsg.innerHTML;
    }); 

     //============================================
     // User log in message receIved from sever  
     //============================================
     
     socket.on("userList", function (data) {
        //grab the userList for where we have to add/remove use name
          populateUserList( data.userdetails);
          
         // var usrname=document.getElementById("usrName").value;
          
          var usrname=""; 
          
          if(document.getElementById("pageType").value=="chat")
             usrname=document.getElementById("usrName").value;
          else 
       	   usrname=document.getElementById("usrAdmName").value;
          
          var selfUser="false";
          if(data.name==usrname) {
              selfUser="true";
          }
          
           var displayName =getDisplayName(data.name, data.fname, data.lname);

           publishMsgToChatArea(displayName,data.msg,data.dt,selfUser,"LOGIN");  
         
         });     

       
       //============================================
       // User Chat message received from sever
       //============================================
       
       socket.on("msg" , function(data){
            var usrname=""; 
           
           if(document.getElementById("pageType").value=="chat")
              usrname=document.getElementById("usrName").value;
           else 
        	   usrname=document.getElementById("usrAdmName").value;
            
            var selfUser="false";
            if(data.name==usrname) {
            	selfUser="true";
            }
            
            var displayName =getDisplayName(data.name, data.fname, data.lname);
            publishMsgToChatArea(displayName,data.msgTxt,data.dt,selfUser,"MSG");
        });
       
     
       //============================================
       // User logout message received from sever
      //============================================
            socket.on("userLoggedOut", function (data) {
                //grab the userList for where we have to add/remove use name
                  var users = document.getElementById("users");

                  //remove the name of logout user information server from user list
                 removeOptionsByValue(users,data.name);
                
                 var msg = data.msgTxt;
                // publishToChatArea(msg);
           
                 var usrname=""; 
                 var logoutType= data.logoutType;
                 
                 var displayName =getDisplayName(data.name, data.fname, data.lname);                 
                
                 if(document.getElementById("pageType").value=="chat")
                    usrname=document.getElementById("usrName").value;
                 else {
                	 if(logoutType=="forced") {
                		 displayName=getDisplayName("", data.fname, data.lname);
                	 }
              	   usrname=document.getElementById("usrAdmName").value;
              	   msg = displayName + " " +msg;
                 }
                 var selfUser="false";
                 if(data.name==usrname) {
                 	selfUser="true";
                 }      

                 publishMsgToChatArea(displayName,msg,data.dt,selfUser,"LOGOUT");
                 
                 // throwing out the user who is forcibily logout by Admin
                  if(logoutType=="forced"){
                	 if(document.getElementById("pageType").value=="chat"){
                	    var  usrName =document.getElementById("usrName").value
                	     if(data.name==usrName) {
                	       document.getElementById("usrName").value="";
                           eraseCK(chatCK);
                           window.location=chatUrl;
                	     }
                	 }
                  }
                 });
  
            
 //------------------------------------------------------------------------                       
//   When User loggedOut button is clicked on, send the message to server
//------------------------------------------------------------------------ 
                  function logoutUsr(){
                  		
                     if(confirm("You will logged out of Chat")){
                         var usrName="";
                       	 if(document.getElementById("pageType").value=="chat"){
                     	     usrName =document.getElementById("usrName").value;
                     	    emitLogoutMsg(usrName);
                            document.getElementById("usrName").value="";
                            eraseCK(chatCK);
                            window.location=chatUrl; 
                            
                       	 }else {
                     	    usrName =document.getElementById("usrAdmName").value;
                      	    emitLogoutMsg(usrName);
                            document.getElementById("usrAdmName").value="";
                            eraseCK(adminCK);
                            window.location=adminUrl;
 
                           }

                      }       
                  }
                      
                  
 // +++++++  RECEIVEING MESSAGES FROM SERVER(OTHER USERS/ADMIN)  +++++++++
            
//------------------------------------------------------------------------  
//   functions emits generic logout Message.
//------------------------------------------------------------------------  
            
	function emitLogoutMsg(usrName){
	    socket.emit("userLoggedOut", {
	        "name": usrName
	    });
	}

	//------------------------------------------------------------------------  
	// function to send message to particular user
	// userLoggedinButton - button id that need to be checked
	// msgTxt - msgText field is
	// pvtMsgType - is pvtMsg or pvtAdmMsg (send by admin)
	//userName - field
	//------------------------------------------------------------------------  	
	function sendMsgTo(userLoggedin, msgTxt,pvtMsgType,usrName, pageType){

      	 if(validateMsg(userLoggedin,msgTxt)==-1)
     		 return -1;
      	 
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
           var usrName=document.getElementById(usrName).value;
           // message that needs to be sent
      
       	  if(touser==usrName)
      	  {
      		 alert("You cannot send message to yourself");
      		 return 0;
      	   }
      	 
       	  
      	  var msgTxt = document.getElementById("msgTxt").value;
      	  
//      	  alert("userLoggedin=" + userLoggedin +", msgTxt =" +  msgTxt + ", pvtMsgType =" + pvtMsgType + ",usrName =" +  usrName +", pageType="+  pageType);
          document.getElementById("msgTxt").value="";
          socket.emit(pvtMsgType, {
              "name": usrName,
              "msgTxt": msgTxt,
              "to" :touser,
              "pageType":pageType
          });
          
	}
	
	
	//------------------------------------------------------------------------  
   //  populate the list of active users in list box                                
   //------------------------------------------------------------------------  
            
       function populateUserList(userList){
    	   
          //grab the userList for where we have to add/remove use name
          var users = document.getElementById("users");
          var option="";
          removeAllOptions(users);
          var usersteemp = userList;

           for (var prop in usersteemp) {
             if (usersteemp.hasOwnProperty(prop)) { 
               option = document.createElement("option");
               option.text =  usersteemp[prop].fName + " " + usersteemp[prop].lName;
               option.value =  usersteemp[prop].usrName;
               users.appendChild(option);
			  }
			}
       }

     //------------------------------------------------------------------------ 
     // function to update the chat area with new incoming message  
     //------------------------------------------------------------------------  
       function publishToChatArea(msg){

            //grab the element for which you've to add the the message from server
            var chatAreaMsg = document.getElementById("chatArea");
            chatAreaMsg.innerHTML +=msg;
            chatAreaMsg.scrollTop = chatAreaMsg.scrollHeight;
       }

       //------------------------------------------------------------------------ 
       // function to update the chat area with new incoming message  - overloaded method
       //------------------------------------------------------------------------  
       
       function publishMsgToChatArea(name,msgTxt,dt,selfUser,msgType){
        
    	   if((msgType=="LOGIN" || msgType=="LOGOUT" ) && selfUser=="true")
    		   return;
    	   
           //grab the element for which you've to add the the message from server
           var chatAreaMsg = document.getElementById("chatArea");
           
           //add the message recieved from server to the element
           //chatAreaMsg.innerHTML +=msg;
           var  msg1="<div class=\"talk-bubble tri-right round btm-left\">";
           var userName=name;
           
          // alert("[name =" + name +"] [ msgTxt " + msgTxt+" ] [dt =" + dt  + "] [ selfUser= " +selfUser+"]"+ "] [ msgType= " +msgType+"]");
           if(msgType=="LOGOUT"){
        	   msg1="<div class=\"talk-bubblelogout\">"; 
        	   //userName="";
           }
           else if(msgType=="LOGIN"){
        	   msg1="<div class=\"talk-bubblelogin\">";   
        	  // userName="";
           }
           else if(selfUser=="true" && msgType=="MSG"){
             msg1="<div class=\"talk-bubbleSelf tri-right round right-in\">";
           }
           
           if(selfUser=="true"){
               userName="Me";
           }

           msg1+="<div class=\"name nameshadow\">";
           msg1+= userName +"</div>";
           msg1+="<div class=\"dt dtshadow\">";
           msg1+= dt +"</div>";
           msg1+="<div class=\"talktext\"><span></span><p>";
           msg1+= msgTxt +"</p></div>"; 
           msg1+="</div>";
           chatAreaMsg.innerHTML +=msg1;            
           chatArea.scrollTop = chatArea.scrollHeight;

       }
       
       
       //------------------------------------------------------------------------           
       //   When send email button is clicked on, send the message to server
       //------------------------------------------------------------------------          
             function sendEmail(){
               	 
                 if(document.getElementById("pageType").value=="chat")
                	 sendMsgTo(chatCK,"msgTxt","emailMsg","usrName", "CHAT");
                  else 
               	    sendMsgTo(adminCK,"msgTxt","emailMsg","usrAdmName","ADMIN");
                 	 
            }
