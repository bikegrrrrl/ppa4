import { formatDateTime } from './utils.js';

/*
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete Appt";
deleteBtn.classList.add("delete-btn");



function formatDateTime(isoString) {
    const date = new Date(isoString);

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

*/

function displayRow(slot) {
    console.log('display row', slot)

    const tbody = document.getElementById("displayRow");
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    //const td5 = document.createElement("td"); // new TD for buttons
    
    
    td1.textContent = formatDateTime(slot.startTime);
    td2.textContent = formatDateTime(slot.endTime);
    td3.textContent = slot.myStatus;
    td4.textContent = slot.myName;
    


    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    //tr.appendChild(td5);
    
    tbody.appendChild(tr);
}


const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete Appt";

// Attach click handler to go to a URL with the slot ID
deleteBtn.addEventListener("click", function () {
    window.location.href = "appt?id=" + encodeURIComponent(slot.id);
});

//td5.appendChild(deleteBtn);



function parseJsonSafely(text) {
    try {
        return { ok: true, value: JSON.parse(text) };
    } catch (err) {
        return { ok: false, value: null };
    }

}


function loadSlots(slotId) {
    const queryString = window.location.search; // "?id=1"
    // Parse 
    const params = new URLSearchParams(queryString);

    // Get the "id" value
    const apptId = params.get('id'); // "1" as a string
    const xhr = new XMLHttpRequest();
    
    xhr.open("GET", "/api/slots?id=" + encodeURIComponent(apptId));
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            const slot = JSON.parse(xhr.responseText);
            console.log("Slot details:", apptId);
            displayRow(slot);   // show in table
        } else {
            console.log("Slot not found");
        }
    };

    xhr.onerror = function() {
        setMessage("Network error while loading slots", "error");
    };
    xhr.send();
}

// Load slots on page load
document.addEventListener("DOMContentLoaded", loadSlots);

// TODO re-load all slots upon adding new slot so they display in order
