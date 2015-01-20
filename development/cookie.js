//TO DO//
// * before adding many prototypes, we need to verify that the currently displayed course matches the course title for the prototype
//this is the staging cookie.js
console.log("development");

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

var prototypes = {
    "prototypeList": {
        1: {
            type: "ab",
            courseIDs: [4259],
            instructorIDs: [1212249],
            prototypeLink: "https://reinvention.flvs.net/plapp/development/pla_app.js",
            criteria: true,
            consoleMessageOnLaunch: "You're getting the A version of PLA.",
            active: false
        },
        2: {
            type: "ab",
            courseIDs: [4259],
            instructorIDs: [1212249],
            prototypeLinkA: "https://reinvention.flvs.net/plapp/development/pla_app.js",
            criteria: "cookie['enrollments'][i]['courseId'].substr(id.length - 1) is odd",
            consoleMessageOnLaunch: "You're getting the B version of PLA.",
            active: false
        },
        3: {
            type: "feature",
            courseIDs: [4025],
            instructorIDs: [1891487, 1408081, 1855468],
            prototypeLink: "https://reinvention.flvs.net/plapp/live/pla_app.js",
            consoleMessageOnLaunch: "",
            criteria: true,
            active: false
        },
        4: {
            type: "feature",
            courseIDs: [4259],
            instructorIDs: [1212249],
            prototypeLink: "https://reinvention.flvs.net/plapp/development/pla_app.js",
            consoleMessageOnLaunch: "",
            criteria: true,
            active: false
        },
        5: {
            type: "ab",
            courseIDs: [4259],
            instructorIDs: [1212249],
            prototypeLink: "https://reinvention.flvs.net/plapp/development/pla_app.js",
            criteria: "7th digit of cookie['enrollments'][i]['courseId'] is even",
            consoleMessageOnLaunch: "",
            active: false
        },
        6: {
            type: "ab",
            courseIDs: [4259],
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

function evaluatePrototypes(prototypeList, cookieInstructorIDArray, cookieCourseIDArray) {
    //loop # of prototypes, use anonymouse function to group the seperate evaluations

    console.log("Cookie course ID array is " + cookieCourseIDArray);
    console.log("Cookie instructor ID array is " + cookieInstructorIDArray);,


    console.log("prototypeList entry 1 has a courseID Array of " + prototypeList[1].courseIDs);
    console.log("prototypeList entry 1 has a instructorID Array of " + prototypeList[1].instructorIDs);

    for (var d = 1; d < 5; d++) {
        console.log("loop number " + d);

        function matchArrays(prototypeList, cookieInstructorIDArray, cookieCourseIDArray, x) {
            console.log("in loop, prototypeList entry " + d + " has a courseID of " + prototypeList[d].courseIDs);
            console.log("in loop, prototypeList entry " + d + " has a instructorID of " + prototypeList[d].instructorIDs);
            console.log("in loop, prototypeList entry active is " + prototypeList[x].active);

            if (evaluateID(prototypeList[d].courseIDs, cookieCourseIDArray) == false) {
                console.log("its false");
            }
            if (evaluateID(prototypeList[d].courseIDs, cookieCourseIDArray) == false) {
                console.log("its true");
            }

            if (evaluateID(prototypeList[d].courseIDs, cookieCourseIDArray) == false) {
                console.log("return false at course ID");
                return false;
            }
            if (evaluateID(prototypeList[d].instructorIDs, cookieInstructorIDArray) == false) {
                console.log("return false at instructor ID");
                return false;
            }
            if (evaluateCriteria(prototypeList[d].criteria) == false) {
                return false;
            }

            prototypeList[x].active = true;
            activePrototypeArray.push(prototypeList[x]);
        }

        matchArrays(prototypeList, cookieInstructorIDArray, cookieCourseIDArray, d);

        console.log("after loop, prototypeList entry active is " + prototypeList[d].active);
        console.log("activePrototypeArray contains " + activePrototypeArray.length + "objects.");

    }

    if (activePrototypeArray.length === 0) {
        console.log(activePrototypeArray.length + " active prototypes");
        return false;
    }
    if (activePrototypeArray.length == 1) {
        console.log(activePrototypeArray.length + " active prototype.");
        return activePrototype[0];
    }
    if (activePrototypeArray.length > 1) {
        console.log(activePrototypeArray.length + " active prototypes...that is too many.");
        return false;
    }
}

function evaluateID(prototypeID, cookieID) {
    console.log("evaluateID has been called.")
    if (Array.isArray(prototypeID)) {
        for (var i = 0; i < prototypeID.length; i++) {
            //branch 1
            if (Array.isArray(cookieID)) {
                for (var j = 0; j < cookieID.length; j++) {
                    if (prototypeID[i] == cookieID[j]) {
                        console.log("Branch 1 true" + prototypeID[i] + " and cookieID " + cookieID[j]);
                    } else {
                        console.log("Branch 1 false" + prototypeID[i] + " and cookieID " + cookieID[j]);
                        return false;
                    }
                }
            }
            //branch 2
            else {
                if (prototypeID[i] == cookieID) {
                    console.log("Branch 2 true" + prototypeID[i] + " " + cookieID + "must be true");
                } else {
                    console.log("Branch 2 false" + prototypeID[i] + " " + cookieID);
                    return false;
                }
            }
        }
    } else {
        //branch 3
        if (Array.isArray(cookieID)) {
            for (var q = 0; q < cookieID.length; q++) {
                if (prototypeID == cookieID[j]) {
                    console.log("Branch 3  true" + prototypeID + " " + cookieID[j] + "must be true");
                } else {
                    console.log("Branch 3  false" + prototypeID + " " + cookieID[j]);
                }
                return false;
            }
        }
    }
    //branch 4
    else {
        if (prototypeID == cookieID) {
            console.log("Branch 4 true " + prototypeID + " " + cookieID);
        } else {
            console.log("Branch 4 false " + prototypeID + " " + cookieID);
            return false;
        }
    }
}
}

function evaluateCriteria(criteria) { //evaluate criteria
    if (criteria) {
        return true;
    } else {
        return false
    }
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

function checkDevelopmentMode(developmentModePrototypeLink, developmentModeConsoleMessageOnLaunch) {
    if (!requireCookie) {
        if (isDebugging) {
            console.log("A cookie is not required for the prototype to display.");
        } else {
            if (isDebugging) {
                console.log("A cookie IS required for the prototype to display.");
            }
        }
        //PUT IN THE PROTOTYPE LINK AND MESSAGE HERE if you are in debug mode
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

$(document).ready(function() {

    checkDevelopmentMode(); //are we in development mode? 

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
            getPrototype(prototypeToLaunch.prototypeLink, prototypeToLaunch.consoleMessageOnLaunch);
        } //LAUNCH IT

    } else {
        if (isDebugging) {
            console.log('Cookie does not exist');
        }
    }

});