//===========================================================================   
// Product : Nibble Chat
// technology : Node.js
// Author : Rahul Kumar Gupta (rahgup@yahoo.com)
// JS Description:
//  This file contains functions related to Admin Login Operations  
//
//=========================================================================== 
//------------------------------------------------------------------------  
//     When admin clicks logged in button is clicked on, send the 
//     message to server
//------------------------------------------------------------------------  
       
        function loginAdmUsr(){
        	 eraseCK(adminCK);
             var usrAdmName =document.getElementById("usrAdmName").value;
             if(usrAdmName.length === 0 || !usrAdmName.trim())
        	 {
        		 alert("Enter Login Name");
        		 return -1;
        	 }  
             createCK(adminCK,usrAdmName,0);
         }  


