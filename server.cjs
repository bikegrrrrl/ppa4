// server.js
// Appointment scheduling server (PPA 3)
// Uses Node.js http module only (no frameworks)
// Sequential POST handling: parameters are passed in the URL query string

const http = require("http");
//const url = require("url");
//const parsed = new URL(req.url, "http://localhost:3000");

/*
const url = require("url");
const parsed = url.parse(req.url, true);
/
New way:
const parsed = new URL(req.url, "http://localhost:3000");
*/

const fs = require("fs");

function serveHtml(res, filePath) {
    fs.readFile(filePath, function (err, content) {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Server error");
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
    });
}

// In memory data model (persistence added in PPA 4)

// add to these as needed
const slots = [
  {
    id: 1,
    startTime: "2026-03-01T09:00",
    endTime: "2026-03-01T09:30",
    myStatus: "Available", 
    myName: "Jen"
  },
  {
    id: 2,
    startTime: "2026-03-01T10:00",
    endTime: "2026-03-01T10:30",
    myStatus: "Available", 
    myName: "John"
  }
];


function sendJson(res, statusCode, payload) {

    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));

}


function nextId() {

    return slots.length + 1;

}


function validateSlotTimes(startTime, endTime) {

    if (typeof startTime !== "string" || startTime.trim().length === 0) {
        return { ok: false, message: "startTime is required" };
    }

    if (typeof endTime !== "string" || endTime.trim().length === 0) {
        return { ok: false, message: "endTime is required" };
    }
    // (bonus): verify endTime is after startTime
    if (endTime < startTime) {
        return {ok: false, message: "startTime must be before endTime"}
    }
    // Check for duplicate - tried this here, and is added to the server, further down
    //const duplicate = isDuplicate(startTime, endTime);
    //if (duplicate === true)  {
    //    return {ok: false, message: "The time slot entered is a duplicate"}
    //    }
    return { ok: true, message: "" };
}


function isDuplicate(startTime, endTime) {
   // return true if a slot with the same times already exists return false;
    for (const s in slots) {
        if (slots[s].startTime === startTime && slots[s].endTime === endTime) {
            console.log ('>>> Dupe found')
            return true;
        }
    }
    // Entered time is not duplicate
    return false;
}

// Check time overlap
function isOverlap(reqStartTime, reqEndTime) {
    // return true if timeslot overlaps any other timeslot
    for (const s in slots) {
        // Scenario: overlap where new timeslot overlaps beginning of another
        if ((slots[s].startTime < reqEndTime) && (slots[s].endTime > reqStartTime)) {
            console.log("Requested timeslot overlaps on existing timeslot");
            return true;
        }
    }
    // else return false, no overlap found
    return false;
}



const server = http.createServer(function (req, res) {
    // const parsed = new URL(req.url, "http://localhost:3000");
    const parsedUrl = new URL(req.url, "http://localhost:3000");
    const path = parsedUrl.pathname;
    const query = Object.fromEntries(parsedUrl.searchParams.entries());

    let filePath = "./public/index.html";

    if (req.url === "/index") { filePath = "./public/index.html"; }
    if (req.url === "/provider") { filePath = "./public/provider.html"; }
    if (req.url === "/client") { filePath = "./public/client.html"; }

    if (req.method === "GET" && path === "/api/slots") {
    
        sendJson(res, 200, slots);
        return;
    }

    if (path === "/provider") {
        serveHtml(res, "./public/provider.html");
        return;
    }

    if (path === "/client") {
        serveHtml(res, "./public/client.html");
        return;
    }
    // Serve up index.html for / or /index
    if (path === "/" || path === "/index") {
        serveHtml(res, "./public/index.html");
        return;
    }

    if (req.url === "/provider.js") {
        fs.readFile("./public/provider.js", function(err, content) {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("File not found");
                return;
            }
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(content);
        });
        return;
    }


        // Serve stylesheet
    if (req.url === "/style.css") {
        fs.readFile("./public/style.css", function(err, content) {
            if (err) {
                res.writeHead(500);
                res.end("File not found");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(content);
        });
        return;
    }


    // valid endpoint
    if (req.method === "POST" && path === "/api/slots") {
        console.log('query:', query);
        
        /*
        const parsedUrl = new URL(req.url, "http://localhost:3000");
        const path = parsedUrl.pathname;

        const startTime = parsedUrl.searchParams.get("startTime");
        const endTime   = parsedUrl.searchParams.get("endTime");
        const myName    = parsedUrl.searchParams.get("myName");
        const myStatus  = parsedUrl.searchParams.get("myStatus");

        */

        const startTime     = query.startTime;
        const endTime       = query.endTime;
        const myName        = query.myName;
        const myStatus      = query.myStatus;
        // TODO validate all input
        const result        = validateSlotTimes(startTime, endTime);
        
        if (!result.ok) {
            sendJson(res, 400, { error: result.message });
            return;
        }

        // prevent duplicates
        if (isDuplicate(startTime, endTime)) {
            sendJson(res, 409, { error: "Duplicate slot" });
            return;
        }

        //prevent overlap
        if (isOverlap(startTime, endTime)) {
            sendJson(res, 409, { error: "Your requested time slot overlaps on another"});
            return;
        }
        
        const slot = {
            id : nextId(),
            startTime : startTime,
            endTime : endTime,
            myName: myName,
            myStatus : myStatus
        };

        slots.push(slot);
        
        sendJson(res, 201, slot);
        return;

    }
    sendJson(res, 404, { error: "Not found" });

});



server.listen(3000, function (){
    console.log("Server running at http://localhost:3000");
})