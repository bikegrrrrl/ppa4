// provider.js
// Interactive UI logic for PPA 3
// Uses XMLHttpRequest (no Promises, no async/await)

function setMessage(text, kind) {
    const p = document.getElementById("message");
    p.textContent = text;

    if (kind === "error") {
        p.className = "error";
    } else {
    p.className = "ok";
    }

}

function addSlotRow(slot) {

    const tbody = document.getElementById("slotTableBody");
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    
    td1.textContent = slot.startTime;
    td2.textContent = slot.endTime;
    td3.textContent = slot.myStatus;
    td4.textContent = slot.myName;
    
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    
    tbody.appendChild(tr);
    
}



function parseJsonSafely(text) {

    try {
        return { ok: true, value: JSON.parse(text) };
    } catch (err) {
        return { ok: false, value: null };
    }

}


// POST /api/slots?startTime=...&endTime=...
function submitNewSlot(startTime, endTime) {

    const xhr = new XMLHttpRequest();

    const requestUrl =
        "/api/slots?startTime=" + encodeURIComponent(startTime) +
        "&endTime=" + encodeURIComponent(endTime) +
        "&myStatus" + encodeURIComponent(myStatus) +
        "&myName=" + encodeURIComponent(myName);

    xhr.open("POST", requestUrl);

    xhr.onload = function () {

        // TODO: parse JSON response safely
        const parsed = parseJsonSafely(xhr.responseText);
        if (!parsed.ok) {
            setMessage("Invalid server response", "error");
            return;
        }
                
        // TODO: if status 201, addSlotRow(slot) and show a success message
        if (xhr.status === 201) {
            const slot = parsed.value;
            addSlotRow(slot);   // show in table
            setMessage("slot created", "ok"); //success message
            //const slot = JSON.parse(xhr.responseText);
            console.log("Created slot:", slot);
            return;
        }

        // TODO: if status 400 or 409, show the server error message
        if (xhr.status === 400 || xhr.status === 409) {
            const err = parsed.value;
            setMessage(err.error, "error");
            console.error(err.error);
            return;
        }
        // TODO: otherwise, show a generic error message
        console.error("Unexpected server error");
    };

    xhr.send();
}


// POST /api/slots?startTime=...&endTime=...
function deleteSlot(startTime, endTime) {

    const xhr = new XMLHttpRequest();

    const requestUrl =
        "/api/slots?startTime=" + encodeURIComponent(startTime) +
        "&endTime=" + encodeURIComponent(endTime);

    xhr.open("DELETE", requestUrl);

    xhr.onload = function () {

        // TODO: parse JSON response safely
        const parsed = parseJsonSafely(xhr.responseText);
        if (!parsed.ok) {
            setMessage("Invalid server response", "error");
            return;
        }
                
        // TODO: if status 201, addSlotRow(slot) and show a success message
        if (xhr.status === 201) {
            const slot = parsed.value;
            //addSlotRow(slot);   // show in table
            setMessage("Slot deleted", "ok"); //success message
            // re load slots
            loadSlots();
            //const slot = JSON.parse(xhr.responseText);
            console.log("Deleted slot:", slot);
            return;
        }

        // TODO: if status 400 or 409, show the server error message
        if (xhr.status === 400 || xhr.status === 409) {
            const err = parsed.value;
            setMessage(err.error, "error");
            console.error(err.error);
            return;
        }
        // TODO: otherwise, show a generic error message
        console.error("Unexpected server error");
    };

    xhr.send();
}



// Optional: load all slots initially
function loadSlots() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/slots");

    xhr.onload = function() {
        if (xhr.status === 200) {
            const parsed = parseJsonSafely(xhr.responseText);
            if (!parsed.ok) {
                setMessage("Failed to parse slots from server", "error");
                return;
            }

            const slots = parsed.value;

            // Clear existing table rows first
            const tbody = document.getElementById("slotTableBody");
            tbody.innerHTML = "";

            // Add each slot to the table
            slots.forEach(addSlotRow);

            setMessage("Slots loaded successfully!", "ok");
        } else {
            setMessage("Failed to load slots from server", "error");
        }
    };

    xhr.onerror = function() {
        setMessage("Network error while loading slots", "error");
    };
    xhr.send();
}


document.getElementById("slotForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const myStatus = document.getElementById("myStatus").value;
    const myName = document.getElementById("myName").value;

    submitNewSlot(startTime, endTime, myStatus, myName);

});



// Load slots when button is clicked
document.getElementById("loadSlotsBtn").addEventListener("click", function() {
    loadSlots();
});


// Load slots on page load
document.addEventListener("DOMContentLoaded", loadSlots);