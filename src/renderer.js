let currentWeatherData = null; // Global variable to store weather data

// Event listener for the location form submission
document.getElementById("location-form").addEventListener("submit", function(event) {
    event.preventDefault();
    buttonClicked(); // Call the function to handle the fetch and display
});

// Fetch weather data and display it
function buttonClicked() {
    const city = document.getElementById("city-input").value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    // Show loading indicator and clear previous data
    document.getElementById("loading").style.display = "block";
    document.getElementById("weather-info").innerHTML = "";

    // Fetch weather data
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${city}`)
        .then((response) => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then((data) => {
            if (data && data.location) {
                currentWeatherData = data; // Store the weather data
                displayWeatherInfo(data);
                document.getElementById("itinerary-form").style.display = "block"; // Show itinerary form
                displayItineraries(); // Display existing itineraries
            } else {
                alert("No weather data found for this location.");
            }
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
        })
        .finally(() => {
            document.getElementById("loading").style.display = "none";
        });
}

// Get clothing recommendation based on temperature and condition
function getClothingRecommendation(temperature, condition) {
    let recommendation = '';

    if (temperature < 0) {
        recommendation = "Wear a heavy winter coat, gloves, and a scarf.";
    } else if (temperature >= 0 && temperature < 10) {
        recommendation = "Wear a warm coat, sweater, and closed shoes.";
    } else if (temperature >= 10 && temperature < 20) {
        recommendation = "Wear a light jacket or sweater and comfortable pants.";
    } else if (temperature >= 20 && temperature < 30) {
        recommendation = "Wear short sleeves, shorts, and sandals.";
    } else {
        recommendation = "Stay cool with light clothing, sunhat, and sunglasses.";
    }

    // Additional recommendations based on conditions
    if (condition.includes("rain")) {
        recommendation += " Don't forget an umbrella!";
    } else if (condition.includes("snow")) {
        recommendation += " Wear waterproof boots.";
    }

    return recommendation;
}

// Display the fetched weather information
function displayWeatherInfo(info) {
    let iconUrl = info.current.condition.icon;
    if (iconUrl && !iconUrl.startsWith("http")) {
        iconUrl = "https:" + iconUrl;
    }

    const weatherInfoDiv = document.getElementById("weather-info");
    const temperature = info.current.temp_c;
    const weatherCondition = info.current.condition.text.toLowerCase();

    // Get clothing recommendation
    const clothingRecommendation = getClothingRecommendation(temperature, weatherCondition);

    // Convert timestamps to local time
    const localTime = new Date(info.location.localtime).toLocaleString();

    weatherInfoDiv.innerHTML = `
        <h2>${info.location.name}, ${info.location.region}, ${info.location.country}</h2>
        <p>Local Time: ${localTime}</p>
        <p>Current Temperature: ${temperature} °C</p>
        <p>Feels Like: ${info.current.feelslike_c} °C</p>
        <p>Forecast Temperature: ${info.forecast.forecastday[0].day.avgtemp_c} °C</p>
        <p>Sunset: ${info.forecast.forecastday[0].astro.sunset}</p>
        <p>Sunrise: ${info.forecast.forecastday[0].astro.sunrise}</p>
        <p>Wind Speed: ${info.current.wind_kph} kph</p>
        <p>Humidity: ${info.current.humidity}%</p>
        <p>Weather Description: ${info.current.condition.text}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <h3>Clothing Recommendation:</h3>
        <p>${clothingRecommendation}</p>
    `;
}

// Event listener for the itinerary form submission
document.getElementById("itinerary-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const city = document.getElementById("city-input").value.trim();
    const activity = document.getElementById("activity-input").value.trim();
    const date = document.getElementById("date-input").value;

    if (city && activity && date) {
        const newItinerary = { city, activity, date };
        const itineraries = JSON.parse(localStorage.getItem("itineraries")) || [];
        itineraries.push(newItinerary);
        localStorage.setItem("itineraries", JSON.stringify(itineraries));

        alert("Itinerary saved successfully!");

        document.getElementById("activity-input").value = "";
        document.getElementById("date-input").value = "";
        
        displayItineraries();
    } else {
        alert("Please fill in all fields before saving.");
    }
});

// Display existing itineraries
function displayItineraries() {
    const itineraryList = document.getElementById("itinerary-list");
    itineraryList.innerHTML = "";

    const itineraries = JSON.parse(localStorage.getItem("itineraries")) || [];
    itineraries.forEach((itinerary, index) => {
        const itineraryItem = document.createElement("div");
        itineraryItem.innerHTML = `
            <p>${itinerary.city}: ${itinerary.activity} on ${itinerary.date}</p>
            <button onclick="editItinerary(${index})">Edit</button>
            <button onclick="deleteItinerary(${index})">Delete</button>
        `;
        itineraryList.appendChild(itineraryItem);
    });
}
