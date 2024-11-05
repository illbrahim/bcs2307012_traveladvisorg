// Update itineraries.js

document.addEventListener("DOMContentLoaded", displayItineraries);

function displayItineraries() {
    const itineraryTableContainer = document.getElementById("itinerary-table-container");
    const itineraries = JSON.parse(localStorage.getItem("itineraries")) || [];

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>City</th>
                    <th>Activity</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="itinerary-table-body">
                ${itineraries.map((itinerary, index) => `
                    <tr>
                        <td>${itinerary.city}</td>
                        <td><input type="text" value="${itinerary.activity}" id="activity-${index}"></td>
                        <td><input type="date" value="${itinerary.date}" id="date-${index}"></td>
                        <td>
                            <button onclick="updateItinerary(${index})">Update</button>
                            <button onclick="deleteItinerary(${index})">Delete</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
    itineraryTableContainer.innerHTML = tableHTML;
}

function searchItineraries() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const itineraries = JSON.parse(localStorage.getItem("itineraries")) || [];
    const filtered = itineraries.filter(itinerary =>
        itinerary.city.toLowerCase().includes(query) ||
        itinerary.activity.toLowerCase().includes(query)
    );

    document.getElementById("itinerary-table-body").innerHTML = filtered.map((itinerary, index) => `
        <tr>
            <td>${itinerary.city}</td>
            <td><input type="text" value="${itinerary.activity}" id="activity-${index}"></td>
            <td><input type="date" value="${itinerary.date}" id="date-${index}"></td>
            <td>
                <button onclick="updateItinerary(${index})">Update</button>
                <button onclick="deleteItinerary(${index})">Delete</button>
            </td>
        </tr>
    `).join("");
}

function updateItinerary(index) {
    const itineraries = JSON.parse(localStorage.getItem("itineraries")) || [];
    const activity = document.getElementById(`activity-${index}`).value;
    const date = document.getElementById(`date-${index}`).value;

    if (activity && date) {
        itineraries[index] = { ...itineraries[index], activity, date };
        localStorage.setItem("itineraries", JSON.stringify(itineraries));
        displayItineraries();
        alert("Data updated");  // Show an alert
    } else {
        alert("Please fill in all fields.");
    }
}


function deleteItinerary(index) {
    const itineraries = JSON.parse(localStorage.getItem("itineraries")) || [];
    itineraries.splice(index, 1);
    localStorage.setItem("itineraries", JSON.stringify(itineraries));
    displayItineraries();
}
