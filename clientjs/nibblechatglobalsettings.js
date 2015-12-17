//===========================================================================   
// Product : Nibble Chat
// technology : Node.js
// Author : Rahul Kumar Gupta (rahgup@yahoo.com)
// JS Description:
//  This file contains global variables  
//
//=========================================================================== 


// var socket = io.connect("http://10.203.101.71:8082");
   //var socket = io.connect("http://10.203.24.33:8082");
    var host="localhost";
    var port="8082";
    var baseURL="http://"+host+":"+port;

    var adminUrl=baseURL+"/nibblechat/admin/";
    var chatUrl=baseURL+"/nibblechat/";
    var adminCK="nibbleadmin";
    var chatCK="nibblechat";
    
    var socket = io.connect(baseURL);