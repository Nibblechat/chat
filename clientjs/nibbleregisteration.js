//===========================================================================   
// Product : Nibble Chat
// technology : Node.js
// Author : Rahul Kumar Gupta (rahgup@yahoo.com)
// JS Description:
//  This file contains user registration forms related methods  
//
//===========================================================================  

var isformvalid =true;
var alertString="";
     	
//------------------------------------------------------------------------ 
//   When User clicks back button on register page 
//------------------------------------------------------------------------ 


function submitUsrBackButton(){
	 eraseCK(chatCK);
   	 window.location =chatUrl;
}
 //------------------------------------------------------------------------ 
 //   When User clicks logged in register button in register page 
//------------------------------------------------------------------------ 	
      
      function submitUsrDetails(){

        var usrName = document.getElementById("usrName").value;
  	    var password = document.getElementById("password").value;
        var repassword = document.getElementById("repassword").value;
        var fName = document.getElementById("FName").value;
  	    var lName = document.getElementById("LName").value;
  	    var genders = document.getElementsByName("gender");
  	    var selectedGender;
  	    for(var i = 0; i < genders.length; i++) {
  	      if(genders[i].checked == true) {
  	         selectedGender = genders[i].value;
  	     }
  	    }
  	   var dob = document.getElementById("dob").value;
  	   var addr1 = document.getElementById("addr1").value;
 	   var addr2 = document.getElementById("addr2").value;
 	   var city = document.getElementById("city").value;
 	   var state = document.getElementById("state").value;
 	   var country = document.getElementById("country").value;
 	   var pincode = document.getElementById("pincode").value;
 	   var mobile = document.getElementById("mobile").value;
 	   var email = document.getElementById("email").value;

 	   alertString="";
 	   isformvalid=true;	
 	   
		ValidateUserName(usrName,4,8);
		ValidatePasswords(password,repassword,4,10);
		ValidateFirstName(fName,1,15);
		ValidateLastName(lName,2,15)
		ValidateAddress1(addr1,5,30)
		ValidateAddress2(addr2,0,30);
		ValidateCity(city,5,15);
		ValidateState(state,2,15);
	    ValidatePincode(pincode,0,6);
		ValidateMobile(mobile,0,12);
	    ValidateEmail(email);  

	    if(isformvalid) {
	 		    
	        socket.emit("userRegister", {
	      	  "usrName" : usrName,  
	      	  "fName" : fName,
	      	  "lName" : lName,
	      	  "gender" : selectedGender, 
	      	  "dob": dob,
	      	  "addr1" : addr1, 
	      	  "addr2" : addr2,
	      	  "city" : city ,
	      	  "state" : state, 
	      	  "country" : country, 
	      	  "pincode" : pincode, 
	      	  "mobile" : mobile,  
	      	  "email" : email, 
	      	  "password" : password
	           
	        });
	        document.forms['userregister'].submit();

	    }
	    else{
	    	alert(alertString);
	    	return false;
	    }
      }

 //------------------------------------------------------------------------ 
 //   Validates UserName on register page 
 //------------------------------------------------------------------------
      
function ValidateUserName(usrName,minsize,maxsize) {

	if(!ValidateAlphaNumeric(usrName, minsize,maxsize) ){
	  alertString += "\nInvalid UserName [Only Alphabets or numbers , Size ["+ minsize +"-"+ maxsize+"]";
	    isformvalid=false;	
	}else
    return true;
}

//------------------------------------------------------------------------ 
//   Validates passwords on register page 
//------------------------------------------------------------------------

function ValidatePasswords(pwd1, pwd2, minsize,maxsize){
	
	if (! ValidateAlphaNumeric(pwd1, minsize,maxsize)
		|| ! ValidateAlphaNumeric(pwd2, minsize,maxsize)){
		   alertString += "\nInvalid Password , Size ["+ minsize +"-"+ maxsize+"]";
	       isformvalid=false;	
		}else if (pwd1!=pwd2)
			{
			   alertString += "\nBoth passwords nor not matching";
		       isformvalid=false;				
	 	}
}

//------------------------------------------------------------------------ 
//   Validates First Name on register page 
//------------------------------------------------------------------------

function ValidateFirstName(fname,minsize,maxsize){
	if(!ValidateAlphaNumericSpaces(fname,minsize,maxsize)){
	   alertString += "\nInvalid FirstName [Only Alphabets or numbers], Size ["+ minsize +"-"+ maxsize+"]";
       isformvalid=false;	
	}else
		return true;
}

//------------------------------------------------------------------------ 
//   Validates Last name on register page 
//------------------------------------------------------------------------

function ValidateLastName(lname,minsize,maxsize){
	if(!ValidateAlphaNumericSpaces(lname,minsize,maxsize)){
	   alertString += "\nInvalid Last Name [Only Alphabets or numbers], Size ["+ minsize +"-"+ maxsize+"]";
       isformvalid=false;	
	}else
		return true;
}

//------------------------------------------------------------------------ 
//   Validates Address Fields on register page 
//------------------------------------------------------------------------

function ValidateAddress1(addr,minsize,maxsize){
	if(!ValidateAlphaNumericSpecialChar(addr,minsize,maxsize)){
	   alertString += "\nInvalid Address 1 [Only Alphabets or numbers or _@./#&+-], Size ["+ minsize +"-"+ maxsize+"]";
       isformvalid=false;	
	}else
		return true;
}

function ValidateAddress2(addr,minsize,maxsize){
	if(!ValidateAlphaNumericSpecialChar(addr,minsize,maxsize)){
	   alertString += "\nInvalid Address 2 [Only Alphabets or numbers or _@./#&+-], Size ["+ minsize +"-"+ maxsize+"]";
       isformvalid=false;	
	}else
		return true;
}

//------------------------------------------------------------------------ 
//   Validates city on register page 
//------------------------------------------------------------------------

function ValidateCity(city,minsize,maxsize){
	if(!ValidateAlphaNumeric(city,minsize,maxsize)){
	   alertString += "\nInvalid City [Only Alphabets or numbers], Size ["+ minsize +"-"+ maxsize+"]";
       isformvalid=false;	
	}else
		return true;
}

//------------------------------------------------------------------------ 
//   Validates state on register page 
//------------------------------------------------------------------------

function ValidateState(state,minsize,maxsize){
	if(!ValidateAlphaNumericSpaces(state,minsize,maxsize)){
	   alertString += "\nInvalid State [Only Alphabets or numbers], Size ["+ minsize +"-"+ maxsize+"]";
       isformvalid=false;	
	}else
		return true;
}

//------------------------------------------------------------------------ 
//   Validates Mobile Number on register page 
//------------------------------------------------------------------------
function ValidateMobile(mobnumber,minsize,maxsize){
	if(!ValidateNumeric(mobnumber,minsize,maxsize)){
	   alertString += "\nInvalid Mobile Number , Size ["+ minsize +"-"+ maxsize+"]";
       isformvalid=false;	
	}else
		return true;
}

//------------------------------------------------------------------------ 
//   Validates Pin/Zip code on register page 
//------------------------------------------------------------------------

function ValidatePincode(pincode,minsize,maxsize){
	if(!ValidateNumeric(pincode,minsize,maxsize)){
	   alertString += "\nInvalid Pincode , Size ["+ minsize +"-"+ maxsize+"]";
       isformvalid=false;	
	}else
		return true;
}

//------------------------------------------------------------------------ 
//   Validates email address on register page 
//------------------------------------------------------------------------

function ValidateEmail(email) {  
   var mailformat = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$");
  
   if(mailformat.test(email))  {
        return true;  
   }
   else  
   {  
    alertString += "\nInvalid email address!";  
    isformvalid=false;
    return false;  
   }  
 } 

