//===========================================================================   
// Product : Nibble Chat
// technology : Node.js
// Author : Rahul Kumar Gupta (rahgup@yahoo.com)
// JS Decription:
//  This file contains functions for user login operations
//   operations
//
//=========================================================================== 

 // ++++++++  RECEIVEING MESSAGES FROM SERVER(OTHER USERS/ADMIN)  ++++++
    
    
   // Response if user already exist server
    socket.on("userExists", function (data) {
     alert("This user name [ "+data.name+" ]  already exists");
    }); 
    
//------------------------------------------------------------------------ 
//   When User clicks logged in button is clicked on, send the message to server
//------------------------------------------------------------------------ 
       function loginUsr(){
    	   
         eraseCK(chatCK);
         var usrName =document.getElementById("usrName").value;
           if(usrName.length === 0 || !usrName.trim())
    	   {
    		 alert("Enter Login Name");
        		 return -1;
        	 } 
   
                createCK(chatCK,usrName,0);
          }  
       

     //------------------------------------------------------------------------ 
     //   When User clicks register button is clicked on login page
     //------------------------------------------------------------------------ 
                     

           function registerUsr(){
               eraseCK(chatCK);
          	     window.location ="/register.html";
             }     
