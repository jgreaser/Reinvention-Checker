//TO DO//
// * before adding many prototypes, we need to verify that the currently displayed course matches the course title for the prototype
//this is the staging cookie.js

//This is the Prodeo prototype launcher and A/B testing tool. Yo.

//test teacher id is 1212249
//var courseIDs = [4025, 4259]; //live course, test course
//var instructorIDs = [1212249, 1891487, 1408081, 1855468]; //testingID, GE, MG, AL 


//MAIN SWITCHES & DEVELOPMENT VARS
var requireCookie = true; // The main switch: true = live course mode, false = development mode
var isDebugging = true; // shows logging
var developmentModePrototypeLink = ""; //whatever you want to launch
var developmentModeConsoleMessageOnLaunch = ""; //whatever you want console launch message to say

// for mobile device check, we assume first that it is not mobile
var mobileDevice = false;

// Arrays to store cookie IDs
var cookieCourseIDArray = [];
var cookieInstructorIDArray = [];

// Store active prototypes
var activePrototypeArray = [];

/////////////////////////
//Prototype Data/////////
/////////////////////////


//criteria for A/B tests must be even/odd. criteria for features can be true, odd, or even
var prototypes = {
    "prototypeList": {
        1: {
            type: "feature",
            courseIDs: [4025],
            instructorIDs: [1891487, 1408081, 1855468],
            prototypeLink: "https://reinvention.flvs.net/plapp/live/pla_app.js",
            criteria: true, //only students with 6th digit of ID is even will recieve
            consoleMessageOnLaunch: "You're getting the A version of PLA.",
            active: false //not currently used
        },
        2: {
            type: "feature",
            courseIDs: [4025],
            instructorIDs: [732487, 1638477, 1897368],
            prototypeLink: "https://reinvention.flvs.net/plapp/version_scaffoldedsearch/pla_app.js",
            criteria: true,//only students with 6th digit of ID is even will recieve
            consoleMessageOnLaunch: "You're getting the B version of PLA.",
            active: false
        },
        3: {
            type: "feature",
            courseIDs: [4259],
            instructorIDs: [1212249],
            prototypeLink: "https://reinvention.flvs.net/plapp/live/pla_app.js",
            consoleMessageOnLaunch: "",
            criteria: true,//ie, all students that match course/instructor criteria will recieve
            active: false
        },
        4: {
            type: "feature",
            courseIDs: [1111],
            instructorIDs: [1111111],
            prototypeLink: "https://reinvention.flvs.net/plapp/version_scaffoldedsearch/pla_app.js",
            consoleMessageOnLaunch: "",
            criteria: true,
            active: false
        },
        5: {
            type: "ab",
            courseIDs: [1111],
            instructorIDs: [1111111],
            prototypeLink: "https://reinvention.flvs.net/plapp/development/pla_app.js",
            criteria: "7th digit of cookie['enrollments'][i]['courseId'] is even",
            consoleMessageOnLaunch: "",
            active: false
        },
        6: {
            type: "ab",
            courseIDs: [1111],
            instructorIDs: [1212249],
            prototypeLink: "https://reinvention.flvs.net/plapp/development/pla_app.js",
            criteria: "cookie['enrollments'][i]['courseId'].substr(id.length - 1) is odd",
            consoleMessageOnLaunch: "",
            active: false
        }
    }
};

////////////////////////////////////////
//COOKIE CHECK & Build Cookie ID array//
////////////////////////////////////////

//jquery cookie plugin
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? a(require("jquery")) : a(jQuery)
}(function(a) {
    function b(a) {
        return h.raw ? a : encodeURIComponent(a)
    }

    function c(a) {
        return h.raw ? a : decodeURIComponent(a)
    }

    function d(a) {
        return b(h.json ? JSON.stringify(a) : String(a))
    }

    function e(a) {
        0 === a.indexOf('"') && (a = a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            return a = decodeURIComponent(a.replace(g, " ")), h.json ? JSON.parse(a) : a
        } catch (b) {}
    }

    function f(b, c) {
        var d = h.raw ? b : e(b);
        return a.isFunction(c) ? c(d) : d
    }
    var g = /\+/g,
        h = a.cookie = function(e, g, i) {
            if (void 0 !== g && !a.isFunction(g)) {
                if (i = a.extend({}, h.defaults, i), "number" == typeof i.expires) {
                    var j = i.expires,
                        k = i.expires = new Date;
                    k.setTime(+k + 864e5 * j)
                }
                return document.cookie = [b(e), "=", d(g), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : ""].join("")
            }
            for (var l = e ? void 0 : {}, m = document.cookie ? document.cookie.split("; ") : [], n = 0, o = m.length; o > n; n++) {
                var p = m[n].split("="),
                    q = c(p.shift()),
                    r = p.join("=");
                if (e && e === q) {
                    l = f(r, g);
                    break
                }
                e || void 0 === (r = f(r)) || (l[q] = r)
            }
            return l
        };
    h.defaults = {}, a.removeCookie = function(b, c) {
        return void 0 === a.cookie(b) ? !1 : (a.cookie(b, "", a.extend({}, c, {
            expires: -1
        })), !a.cookie(b))
    }
});


function doesCookieExist() {
    if (typeof $.cookie("vsaSession") === "undefined") {
        return false;
    } else {
        return true;
    }
}



function buildCookieIDArrays() {

    var cookieEnrollmentsLength = cookie['enrollments'].length;

    for (z = 0; z < cookieEnrollmentsLength; z++) {
        cookieCourseIDArray.push(cookie['enrollments'][z]['courseId']);
        cookieInstructorIDArray.push(cookie['enrollments'][z]['instructorId']);
    }
}

/////////////////////////
//EVALUATING PROTOTYPES//
/////////////////////////

function evaluatePrototypes(prototypeList, cookieCourseIDArray, cookieInstructorIDArray) {
    //loop # of prototypes, use anonymouse function to group the seperate evaluations

    for (var d = 1; d < 5; d++) {

        (function () {
            //evalu COURSE ID
            if (evaluateID(prototypeList[d].courseIDs, cookieCourseIDArray) == false) {
                return false;
            }
            //eval INSTRUCTOR ID
            if (evaluateID(prototypeList[d].instructorIDs, cookieInstructorIDArray) == false) {
                return false;
            }
            //eval criteria
            if (evaluateCriteria(prototypeList[d].criteria) == false) {
                return false;
            }
            //if false isn't received yet, add this prototype to the activePrototypeArray
            activePrototypeArray.push(prototypeList[d]);
        }());

    }

    if (activePrototypeArray.length === 0) {
       if (isDebugging){console.log(activePrototypeArray.length + " active prototypes");}
       
        return false;
    }
    if (activePrototypeArray.length == 1) {
        if (isDebugging){console.log(activePrototypeArray.length + " active prototype.");}
        return activePrototypeArray[0];
    }
    if (activePrototypeArray.length > 1) {
       if (isDebugging){console.log(activePrototypeArray.length + " active prototypes...that is too many.");}
        return false;
    }
}

function evaluateID(prototypeID, cookieID) {
      if (isDebugging){console.log("evaluating " + prototypeID + " and " + cookieID);}

    var matchFound = 0;

    if (Array.isArray(prototypeID)) {
        for (var i = 0; i < prototypeID.length; i++) {
            
            if (Array.isArray(cookieID)) {
                for (var j = 0; j < cookieID.length; j++) {

                      if (isDebugging){console.log("deep in loop, cookieID is " + cookieID[j]);}
                   
                    if (prototypeID[i] == cookieID[j]) {
                         if (isDebugging){console.log("match found " + prototypeID[i] + " and cookieID " + cookieID[j]);}
                        matchFound++;
                    } else {
                        if (isDebugging){console.log("no match " + prototypeID[i] + " and cookieID " + cookieID[j]);}
                    }
                }  
            }   
        } 
    }
    else {  if (isDebugging){console.log("not an array, apparently")}}

    //only returns a false if there are zero matches
    if (matchFound === 0){return false;}
}

function evaluateCriteria(criteria) { //evaluate criteria

    if (isDebugging){console.log("Criteria is " + criteria);}

    //get a number from ID to determine odd/even
    var userIdLastDigit = parseInt(cookie['user']['userId'].substr(6, 10));
    var userIdModulusTwo = (userIdLastDigit) % 2;
    
    if (isDebugging){console.log("userIdModulusTwo is " + userIdModulusTwo);}

    //return true if true
    if (criteria == true){return true;}

    //return true if even
    else if (criteria == "even"){if (userIdModulusTwo == 0){console.log("return true"); return true;}else{console.log("return false"); return false;}}
    
    //return true if odd
    else if (criteria == "odd"){if (userIdModulusTwo != 0){console.log("return true"); return true;}else{console.log("return false"); return false;}}
    
    //return false, cause criteria doesn't exist
    else {console.log("criteria: " + criteria);console.log("Criteria doesn't exist in current criteria options. Check your spelling!"); return false;}
}

//////////////////////////
//Check if mobile device//
//////////////////////////

function detectmob() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}


//////////////////////////////
//Development mode functions//
//////////////////////////////

//for when you need to test outside of VSA

function checkDevelopmentMode(developmentModePrototypeLink, developmentModeConsoleMessageOnLaunch) {
    if (!requireCookie) {
        if (isDebugging) {
            console.log("A cookie is not required for the prototype to display.");
        } else {
            if (isDebugging) {
                console.log("A cookie IS required for the prototype to display.");
            }
        }
        //get the prototype using vars from var section at top of script
        getPrototype(developmentModePrototypeLink, developmentModeConsoleMessageOnLaunch);
    }
}


/////////////////////////
//LAUNCH PROTOTYPE///////
/////////////////////////

function getPrototype(prototypelink, consoleMessage) {
    $.getScript(prototypelink, function() {
        if (isDebugging) {
            console.log(consoleMessage);
        }  
    });
}

/////////////////////////
///DOCUMENT READY ///////
/////////////////////////

$(document).ready(function() {

    //check to see if we're in dev mode
    checkDevelopmentMode();

    //checks to see if cookie exists. If yes, do everything else.
    if (doesCookieExist()) {
        cookie = jQuery.parseJSON($.cookie("vsaSession"));

        mobileDevice = detectmob();

        buildCookieIDArrays();

        prototypeToLaunch = evaluatePrototypes(prototypes.prototypeList, cookieCourseIDArray, cookieInstructorIDArray);

        if (!prototypeToLaunch) {
            console.log("Nothing to launch")
        } // no matching course ID & instructor ID
        else if (mobileDevice) {
            console.log("Will not launch for mobile devices.");
        } // no launch for mobile
        else {
            console.log("should launch now, link:" + prototypeToLaunch.prototypeLink + " and message " + prototypeToLaunch.consoleMessageOnLaunch);
            getPrototype(prototypeToLaunch.prototypeLink, prototypeToLaunch.consoleMessageOnLaunch);
        } //LAUNCH IT

    } else {
        if (isDebugging) {
            console.log('Cookie does not exist');
        }
    }

});