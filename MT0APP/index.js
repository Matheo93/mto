const searchBox = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const notFound = document.querySelector(".not-found");
const historyTableBody = document.getElementById("history-body");
const clearHistoryButton = document.getElementById("clear-history");

window.addEventListener("load", () => {
  const storedHistory = JSON.parse(localStorage.getItem("queryHistory")) || [];
  storedHistory.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${entry.city}</td>
            <td>${entry.temp}°C</td>
            <td>${entry.description}</td>
        `;
    historyTableBody.appendChild(row);
  });
});

searchButton.addEventListener("click", () => {
  const APIKey = "d69c36a86dfd6d1cd5c1066f5c1dbb3f";
  const city = searchBox.value;

  if (city === "") return;

  console.log(`Fetching weather data for: ${city}`);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (json.cod === "404") {
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        notFound.style.display = "block";
        return;
      }

      notFound.style.display = "none";
      weatherBox.style.display = "";
      weatherDetails.style.display = "";

      const image = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span"
      );
      const wind = document.querySelector(".weather-details .wind span");

      switch (json.weather[0].main) {
        case "Clear":
          image.src = "images/clear.png";
          break;

        case "Rain":
          image.src = "images/rain.png";
          break;

        case "Snow":
          image.src = "images/snow.png";
          break;

        case "Clouds":
          image.src = "images/cloud.png";
          break;

        case "Mist":
          image.src = "images/mist.png";
          break;

        default:
          image.src = "";
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${city}</td>
                <td>${parseInt(json.main.temp)}°C</td>
                <td>${json.weather[0].description}</td>
            `;
      historyTableBody.appendChild(row);

      const storedHistory =
        JSON.parse(localStorage.getItem("queryHistory")) || [];
      storedHistory.push({
        city: city,
        temp: parseInt(json.main.temp),
        description: json.weather[0].description,
      });
      localStorage.setItem("queryHistory", JSON.stringify(storedHistory));
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
});

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem("queryHistory");
  historyTableBody.innerHTML = "";
});
