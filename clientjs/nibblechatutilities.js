//===========================================================================   
// Product : Nibble Chat
// technology : Node.js
// Author : Rahul Kumar Gupta (rahgup@yahoo.com)
// JS Description:
//  This file contains functions utility functions  
//
//===========================================================================        
 

     //------------------------------------------------------------------------  
     // check for emptiness of  the message txt field  
     //------------------------------------------------------------------------  
       
       function isMsgTxtEmpty(msgField){
        	 var msgTxt = document.getElementById(msgField).value;
        	 if(isEmpty(msgTxt))
        	 {
        		 alert("Enter Message");
        		 return -1;
        	 }  
      } 

       //-----------------------------------------------------------------------------  
       // checking the size of string.  
       //-----------------------------------------------------------------------------

       
       function islengthInRange(alphastr,minsize, maxsize){
    	   return (alphastr != null && alphastr.length>(minsize-1) && alphastr.length<(maxsize+1));
       }

       //-----------------------------------------------------------------------------  
       // validate Alphanumeric Values with spaces of field. if minsize is 0 then field is optional  
       //-----------------------------------------------------------------------------
       
       function ValidateAlphaNumericSpecialChar(alphaStr,minsize, maxsize) {
    	   var letters = new RegExp("^[ A-Za-z0-9_@./#&+-]*$");
  		  if(minsize==0 && isEmpty(alphaStr))
 			  return true; 
    	   if(isEmpty(alphaStr) 
    		    || !islengthInRange(alphaStr,minsize, maxsize) 
    		    || !letters.test(alphaStr)  
    		    ){
    		      return false;
    		    }else
    	         return true;
    
    	    
    	 }
       
   //-----------------------------------------------------------------------------  
   // validate Alphanumeric Values with spaces of field. if minsize is 0 then field is optional  
   //-----------------------------------------------------------------------------
   
   function ValidateAlphaNumericSpaces(alphaStr,minsize, maxsize) {
	   var letters = new RegExp("^[ A-Za-z0-9_]*$");	  
	  if(minsize==0 && isEmpty(alphaStr))
		  return true;
	   if(isEmpty(alphaStr) 
		    	|| !islengthInRange(alphaStr,minsize, maxsize) 
		    	|| !letters.test(alphaStr)
		    	){
		      return false;
		    }else
	         return true;
    
	 }
   
   //-----------------------------------------------------------------------------  
   // validate Alphanumeric Values of field. if minsize is 0 then field is optional  
   //-----------------------------------------------------------------------------
   
   function ValidateAlphaNumeric(alphaStr,minsize, maxsize) {

	    var letters = new RegExp("^[a-zA-Z0-9]*$");
    		  if(minsize==0 && isEmpty(alphaStr))
      			  return true;		  
    		    if(isEmpty(alphaStr) 
    		    	|| !islengthInRange(alphaStr,minsize, maxsize) 
    		    	|| !letters.test(alphaStr)
    		    	){
	    	
    		      return false;
    		    }else
    	         return true;
    	 }
    
   
       //-----------------------------------------------------------------------------  
   // validate Alphanumeric Values of field. if minsize is 0 then field is optional  
   //-----------------------------------------------------------------------------
   
   function ValidateNumeric(numberstr,minsize, maxsize) {
		var letters = new RegExp("^[0-9]+$");
	  if(minsize==0 && numberstr.length==0)
		  return true;
   	  if(isEmpty(""+numberstr) 
	    	|| !islengthInRange(""+numberstr,minsize, maxsize) 
	    	|| !letters.test(""+numberstr)
	    	){
	      return false;
	    }else
         return true;
    
	 }
 
   
   
   //------------------------------------------------------------------------  
   // check for emptyness of  the message txt  
   //------------------------------------------------------------------------  
    
  function isEmpty(mgTxt){
 	 if(mgTxt.length == 0 || !mgTxt.trim())
	 {
		 return true;
	 }else
		 return false;
  }  
  
  
 //------------------------------------------------------------------------  
 // check if user is logged in or not   
 //------------------------------------------------------------------------  
  function isUserLoggedIn(userCK){
	  var msgTxt = readCK(userCK);
 	   if(msgTxt==null || msgTxt.length === 0 || !msgTxt.trim())
	   {
 		 alert("Please Sign in First");
 		 return -1;
 	   }

  }
  
//------------------------------------------------------------------------  
// method to remove all the options of the list box
//------------------------------------------------------------------------  
  
  function removeAllOptions(selectbox)
  {
      var i;
      for(i=selectbox.options.length-1;i>=0;i--)
      {
          selectbox.remove(i);
      }
  }
  
//------------------------------------------------------------------------  
// remove the options from list with specified value
//------------------------------------------------------------------------  
      
  function removeOptionsByValue(selectBox, value)
  {
    for (var i = selectBox.length - 1; i >= 0; --i) {
      if (selectBox[i].value == value) {
        selectBox.remove(i);
      }
    }
  }

  
//------------------------------------------------------------------------   
//  When send button is clicked on, send the message to server
//------------------------------------------------------------------------    
      
         function validateMsg(userCK,msgField){
     	  
           if (isUserLoggedIn(userCK) ==-1 ||isMsgTxtEmpty(msgField) ==-1)
           {
             return -1;
           }
        }
  
         
         
     //------------------------------------------------------------------------   
 //  create cookie methods
 //------------------------------------------------------------------------   
   function createCK(CKName,ckvalue,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = CKName+"="+ ckvalue + expires+"; path=/";
	}

   //------------------------------------------------------------------------   
   //  read cookie methods
   //------------------------------------------------------------------------              
	function readCK(CKName) {
		var nameEQ = CKName + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) 
			  return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	

    //------------------------------------------------------------------------   
    //  read cookie value method
    //------------------------------------------------------------------------        
	
	function readCKValue(CKName,no){
		if(readCK(CKName)==null)
			return -1;
			
	    var ckValue= readCK(CKName).split(',')	;
		if(ckValue.length>=no)
		  return ckValue[no-1];
		else
			return -1;
	}

	
    //------------------------------------------------------------------------   
    //  remove cookie methods
    //------------------------------------------------------------------------   
	
	function eraseCK(CKName) {
		createCK(CKName,"",-1);
	}

	
	//-------------------------------------------------------------------------
	//Query string value
	//-------------------------------------------------------------------------
	
	function getQueryVariable(variable) {
		  var query = window.location.search.substring(1);
		  var vars = query.split("&");
		  for (var i=0;i<vars.length;i++) {
		    var pair = vars[i].split("=");
		    if (pair[0] == variable) {
		      return pair[1];
		    }
		  } 
//		  alert('Query Variable ' + variable + ' not found');
		}
	
	
    
    //------------------------------------------------------------------------           
    //   compute display name
    //------------------------------------------------------------------------ 
    
   function getDisplayName(name, fname, lname){
       var displayName;
       
       if( isEmpty(fname))
     	  displayName= name;
       else
     	  displayName=fname + " " +lname;

       return displayName;
   }