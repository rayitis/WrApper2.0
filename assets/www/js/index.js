/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {

        document.getElementById("submit").addEventListener("click", submit);
        //HTML history buttons
        document.getElementById("submitfromhist0").addEventListener("click", submitFromHist0);
        document.getElementById("submitfromhist1").addEventListener("click", submitFromHist1);
        document.getElementById("submitfromhist2").addEventListener("click", submitFromHist2);
        document.getElementById("submitfromhist3").addEventListener("click", submitFromHist3);
        document.getElementById("submitfromhist4").addEventListener("click", submitFromHist4);

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var theHtmlLoc="";
var theHtmlHist = ["theHtmlHist0","theHtmlHist1","theHtmlHist2","theHtmlHist3","theHtmlHist4"];
theHtmlArr = ["theHtml0","theHtml1","theHtml2","theHtml3","theHtml4"];
//var validPageFlag = 0;

function submit() {
    theHtmlLoc = document.getElementById("htmllocation").value;
    getFreshHtml();
    //saveHtmlLoc(theHtmlLoc); //save URL only
    window.location="page1.html";
}

function submitFromHist0() {
    getHtmlFromCache(0);
    window.location="page1.html";
}

function submitFromHist1() {
    getHtmlFromCache(1);
    window.location="page1.html";
}
function submitFromHist2() {
    getHtmlFromCache(2);
    window.location="page1.html";
}
function submitFromHist3() {
    getHtmlFromCache(3);
    window.location="page1.html";
}
function submitFromHist4() {
    getHtmlFromCache(4);
    window.location="page1.html";
}

function getFreshHtml() {
    console.log("**** IN GETHTML:"+theHtmlLoc);
    setCurrentHtml("ERROR: Invalid HTML page location");
    httpGetAsync(theHtmlLoc+"?x="+cacheBuster());
    //console.log("in greFreshHtml() validPageFlag:"+getValidPageFlag()+"**");
    //saveHtmlLoc(theHtmlLoc); //save URL only
}

function getHtmlFromCache(num) {
    theHtmlArr = ["theHtml0","theHtml1","theHtml2","theHtml3","theHtml4"];
    console.log("**** IN GETHTMLFromCache:"+theHtmlArr[num]+localStorage.getItem(theHtmlArr[num])+"***");
    localStorage.setItem("theCurrentHtml",localStorage.getItem(theHtmlArr[num]));
}

function saveHtmlLoc(theHtmlLoc) {
    moveHistElementDown(theHtmlLoc);
    localStorage.setItem(theHtmlHist[0], theHtmlLoc);
}

function checkEmptyHistElement(){
    for(x=0; x!=5; x++) {
        alert("loop:"+x+"  "+localStorage.getItem(theHtmlHist[x]));
        if(localStorage.getItem(theHtmlHist[x]) == "") {
            alert("found empty slot on:"+x);
            localStorage.setItem(theHtmlHist[x], theHtmlLoc);
            //break;
            return true;
        } else if(x==4) {
            alert("NO empty slot on: dropping on first**");

           //break;
        }
    }
}

function moveHistElementDown(theHtmlLoc) { //push other elements higher in the list before plugging in on the first element
    for(i=4; i!=0; i--) {
        localStorage.setItem(theHtmlHist[i],localStorage.getItem(theHtmlHist[i-1]));
        //alert("setting:"+theHtmlHist[i]+" with the one in "+ theHtmlHist[i-1] + " = " +localStorage.getItem(theHtmlHist[i-1]));
    }
}

function viewHtmlHist(ctr) {
    theHtmlHist = ["theHtmlHist0","theHtmlHist1","theHtmlHist2","theHtmlHist3","theHtmlHist4"];
    var theHtmlHistList = [];
    for(y=0; y!=theHtmlHist.length; y++) {
        theHtmlHistList[y] = localStorage.getItem(theHtmlHist[y]);
        if(theHtmlHistList[y]=="null" || theHtmlHistList[y]==null) {//check if null
            theHtmlHistList[y]=" ";
        }
    }
    return theHtmlHistList;
}

function getSynchHtml(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log('the html ***= '+xmlHttp.responseText+' =****the html');
}


function httpGetAsync(theUrl, callback) {
    console.log('Received Event: httpGetAsync****'+theUrl+'***');
    var xmlHttp = new XMLHttpRequest();
    var ctr = 0;
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            html = xmlHttp.responseText;
            console.log("IN httpGetAsync****" + html);
            console.log("LOG 1: " + ctr++);
            setCurrentHtml(html);
            storeHtml();
            saveHtmlLoc(theHtmlLoc); //save URL only
         } else {
            console.error("Error: Site not ready. HTTP Ready State is " +
                xmlHttp.readyState + " and HTTP Status is " + xmlHttp.status + ctr++);

         }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
    //console.log('THE HTML in httpGetAsync: '+html+' :THE HTML');
}

//validPageFlag = "0"; ** DELETE IF NOT USED
function setValidPageFlag(val) {
    localStorage.setItem("validPageFlag",val);
    console.log("validPageFlag is:"+localStorage.getItem("validPageFlag")+"***");
    //return null;
}

//** DELETE IF NOT USED
function getValidPageFlag() {
    console.log("*** Here in getValidPageFlag()**");
    return localStorage.getItem("validPageFlag");
    //return "1";
}

function storeHtml() {
    console.log('****Received Event: storeHtml');
    moveTheHtmlDown();
    localStorage.setItem(theHtmlArr[0], pullHtml()); //always save on top of history
    console.log("HTML Stored. Content is: "+pullHtml()+" stored in key "+theHtmlArr[0]);
}

function moveTheHtmlDown() { //push other elements higher in the list before plugging in on the first element
    for(j=4; j!=0; j--) {
        localStorage.setItem(theHtmlArr[j],localStorage.getItem(theHtmlArr[j-1]));
    }
}

function pullHtml() {
    //console.log('Received Event: pullHtml. The html is ->'+theHtml);
    return localStorage.getItem("theCurrentHtml");
    //return theHtml;
}

function pullHtmlFromStorage(p) {
    console.log('Received Event: pullHtmlfromStorage ' +p+"***");
    return localStorage.getItem(theHtmlArr[p]);
}

function setCurrentHtml(html) {
    //theHtml=html;
    localStorage.setItem("theCurrentHtml",html);
}


function cacheBuster() {
    return Math.random()*1000000;
}

/* Navigation Menu */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
/* Navigation Menu - end */



