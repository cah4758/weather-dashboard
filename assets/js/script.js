var weatherAPI = "eda8e34a538f7ace194365398b04b93a";
var searchForm = document.getElementById("search-form");
var searchTerm = document.getElementById("search-input");
var pastSearches = document.querySelector(".past-searches");
var cityEl = document.getElementById("city");
var conditionEl = document.getElementById("condition");
var todayEl = document.getElementById("today");
var weatherIcon = document.getElementById("icon");
var tempSpan = document.getElementById("temp");
var windSpan = document.getElementById("wind");
var humSpan = document.getElementById("humidity");
var uvSpan = document.getElementById("uv-index");
var forecastEl = document.querySelector(".forecast-container");
var listGroup = document.getElementById("past-cities");
var cityStorage = [];

function searchFormSubmit(event) {
  event.preventDefault();

  var city = searchTerm.value;

  if (cityStorage.indexOf(city) === -1) {
    cityStorage.push(city);
  }

  window.localStorage.setItem("city", JSON.stringify(cityStorage));
  getCities(cityStorage);

  if (!city) {
    alert("Enter a city so we can get you the weather!");
  }

  weatherLookUp(city);
}

function weatherLookUp(city) {
  // Taking city name and converting to lat and long
  var latLonLkup = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPI}`;
  console.log(latLonLkup);
  forecastEl.innerHTML = "";

  // Using lat and long to access One Call API
  fetch(latLonLkup)
    .then((response) => response.json())
    .then((data) => {
      var lat = data[0].lat;
      var lon = data[0].lon;

      var searchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${weatherAPI}`;
      console.log(searchUrl);

      fetch(searchUrl)
        .then((response) => response.json())
        .then((data) => {
          var futureDate = new Date(data.current.dt * 1000); // puts full unix date
          let year = futureDate.getFullYear(); // takes out the year
          let month = futureDate.getMonth() + 1; // takes out the month +1 since Jan = 0
          let day = futureDate.getDate(); // takes out day

          cityEl.textContent = city + " " + month + "/" + day + "/" + year;
          conditionEl.textContent = data.current.weather[0].description;
          tempSpan.textContent = data.current.temp;
          windSpan.textContent = data.current.wind_speed;
          humSpan.textContent = data.current.humidity;

          // Setting UV index box colors
          uvSpan.textContent = data.current.uvi;
          if (data.current.uvi < 3) {
            uvSpan.classList.add("low");
          } else if (data.current.uvi < 6) {
            uvSpan.classList.add("moderate");
          } else if (data.current.uvi < 8) {
            uvSpan.classList.add("high");
          } else if (data.current.uvi < 11) {
            uvSpan.classList.add("very-high");
          } else {
            uvSpan.classList.add("extreme");
          }

          // Adding url for weather icon
          var icon = data.daily[0].weather[0].icon;
          var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
          weatherIcon.src = iconUrl;

          //Forecast cards loop
          for (var index = 1; index < 6; index++) {
            var futureDate = new Date(data.daily[index].dt * 1000); // puts full unix date
            let year = futureDate.getFullYear(); // takes out the year
            let month = futureDate.getMonth() + 1; // takes out the month +1 since Jan = 0
            let day = futureDate.getDate(); // takes out day

            var fCard = document.createElement("div");
            fCard.classList.add("future-card");
            fCard.innerHTML = "";
            var date = document.createElement("h4");
            date.textContent = month + "/" + day + "/" + year;
            var fTemp = document.createElement("h5");
            fTemp.textContent = "Temp: " + data.daily[index].temp.day;
            var fWind = document.createElement("h5");
            fWind.textContent = "Wind: " + data.daily[index].wind_speed;
            var fHum = document.createElement("h5");
            fHum.textContent = "Humidity: " + data.daily[index].humidity;
            var br = document.createElement("br");

            fCard.append(date, fTemp, fWind, fHum);
            forecastEl.appendChild(fCard);
          }
        });
    });
}

listGroup.addEventListener("click", function (event) {
  event.preventDefault();
  if (event.target && event.target.matches(".recent-search")) {
    searchFormSubmit(event.target.textContent);
  }
});

function getCities(arr) {
  listGroup.innerText = "";
  for (const element of arr) {
    // <li class="list-group-item">An item</li>
    var listGroupItem = document.createElement("li");
    var linkItem = document.createElement("a");

    listGroupItem.classList.add("list-group-item");
    linkItem.classList.add("recent-search");
    linkItem.setAttribute("href", "#");
    linkItem.setAttribute("data-name", element);
    linkItem.textContent = element;

    listGroup.append(listGroupItem);
    listGroupItem.append(linkItem);
  }
}

searchForm.addEventListener("submit", searchFormSubmit);
getCities(cityStorage);
