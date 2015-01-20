//this is the staging cookie.js

//This prototype brought to you by Prodeo.
//test teacher id is 1212249

var courseIDs = [4025, 4259]; //live course, test course
var instructorIDs = [1212249, 1891487, 1408081, 1855468]; //testingID, GE, MG, AL 


var requireCookie = true; // The main switch: true = live course mode, false = testing mode
var isDebugging = false;	// shows logging

var validCourse = false;
var validInstructor = false;
var mobileDevice = false;

// Check if the VSASession cookie exists
	function doesCookieExist(){
		if( typeof $.cookie("vsaSession") === "undefined" ) {
			return false;
		}else{
			return true;
		}
	}


// Check if the course ID is in the array of courseIDs
	function isValidCourse(courseID){
		if( courseIDs.indexOf(parseInt(courseID)) > -1 ){
			return true;
		}else{
			return false;
		}
	}


// Check if the instructor ID is in the array of instructorIDs
	function isValidInstructor(instructorID){
		if( instructorIDs.indexOf(parseInt(instructorID)) > -1 ){
			return true;
		}else{
			return false;
		}
	}

	function cycleThroughEnrollments(){
	for( i=0; i < cookie['enrollments'].length; i++ ){
		 if(isValidCourse(cookie['enrollments'][i]['courseId']))
		 	{console.log("validCourse=true");
		 		validCourse = true;
			}
		 if(isValidInstructor(cookie['enrollments'][i]['instructorId']))
		 	{console.log("validInstructor=true");

		 		validInstructor = true;
		 	}
	}
}


//Check device

function detectmob() { 
if( navigator.userAgent.match(/Android/i)
|| navigator.userAgent.match(/webOS/i)
|| navigator.userAgent.match(/iPhone/i)
|| navigator.userAgent.match(/iPad/i)
|| navigator.userAgent.match(/iPod/i)
|| navigator.userAgent.match(/BlackBerry/i)
|| navigator.userAgent.match(/Windows Phone/i)
){
    return true;
  }
else {
    return false;
  }
}

$(document).ready(function(){

	function getPLA(){
		
		$.getScript("https://reinvention.flvs.net/plapp/live/pla_app.js", function(){
			if(isDebugging){
			console.log('pla_app.js loaded successfully from getPLA');
			}
		});
	}

	if (!requireCookie){
		if(isDebugging){
			console.log("A cookie is not required for the prototype to display.");
		}
		getPLA();
	}
	else {
		
		if(isDebugging){
			console.log("A cookie is required to diplay prototype. Further logs will report cookie status.");
		}
		$.getScript("https://reinvention.flvs.net/checker/jquery.cookie.js", function(){
			
			if(isDebugging){
				//console.log($.cookie("vsaSession"));
				console.log('jquery.cookie.js loaded');
			}

			if(doesCookieExist()){
				cookie = jQuery.parseJSON($.cookie("vsaSession"));

				cycleThroughEnrollments();  //function cycles through and sets validCourse/validInstructor to true if they are found in cookie

				mobileDevice = detectmob();

				//IF BOTH validCourse & validInstructor are true and mobileDevice is false, call the PLA
				if (validCourse && validInstructor && !mobileDevice){
					$.getScript("https://reinvention.flvs.net/plapp/live/pla_app.js", function(){
								if(isDebugging){
									console.log('Personal Learning Assistant is loading.');
								}
							});
				}
				//IF NOT, then log error
				else{
					if(!validCourse){
						if(isDebugging){
									console.log('There is not a valid course in cookie.');
								}
					}	
					if(!validInstructor){
						if(isDebugging){
									console.log('There is not a valid instructor in cookie.');
								}
					}	
					if(mobileDevice){
						if(isDebugging){
									console.log('Will not launch for mobile devices.');
								}
					}							
					}



			}else{
				if(isDebugging){
				console.log('Cookie does not exist');
				}
			}
			
		});
	}

	
	
});