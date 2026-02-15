//
//

// Run this after the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Get the full URL query string
    const queryString = window.location.search; // "?id=1"

    // Parse it
    const params = new URLSearchParams(queryString);

    // Get the "id" value
    const slotId = params.get('id'); // "1" as a string

    if (!slotId) {
        console.log("No slot ID provided in the URL");
        return;
    }

    console.log("Slot ID from URL:", slotId);

    // Now you can use slotId to fetch the slot details from your server
    // Example:
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/slots?id=" + encodeURIComponent(slotId));
    xhr.onload = function() {
        if (xhr.status === 200) {
            const slot = JSON.parse(xhr.responseText);
            console.log("Slot details:", slot);
        } else {
            console.log("Slot not found");
        }
    };
    xhr.send();
});

function parseJsonSafely(text) {
    try {
        return { ok: true, value: JSON.parse(text) };
    } catch (err) {
        return { ok: false, value: null };
    }

}


function loadSlots(id) {
    const xhr = new XMLHttpRequest();
    // xhr.open("GET", "/api/slots");
    xhr.open("GET", "/api/slots?id=" + encodeURIComponent(id));

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

console.log(id)
