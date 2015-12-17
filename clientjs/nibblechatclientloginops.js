//===========================================================================   
// Product : Nibble Chat
// technology : Node.js
// Author : Rahul Kumar Gupta (rahgup@yahoo.com)
// JS Decription:
//  This file contains functions for user login operations
//   operations
//
//=========================================================================== 
       
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
                  

