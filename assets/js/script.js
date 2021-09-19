var weatherAPI = 'eda8e34a538f7ace194365398b04b93a';
var searchForm = document.getElementById("search-form");
var searchTerm = document.getElementById("search-input");
var pastSearches = document.querySelector(".past-searches");
var cityEl = document.getElementById("city");
var todayEl = document.getElementById("today");
var weatherIcon = document.getElementById("icon");
var tempSpan = document.getElementById("temp");
var windSpan = document.getElementById("wind");
var humSpan = document.getElementById("humidity");
var uvSpan = document.getElementById("uv-index");
var forecastEl = document.querySelector("future-card");

function searchFormSubmit(event) {
    event.preventDefault();

    var city = searchTerm.value;
    console.log(city);

    if (!city) {
        alert("Enter a city so we can get you the weather!");
    }
    
    // Taking city name and converting to lat and long
    var latLonLkup = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAPI}`;
    console.log(latLonLkup);

    // Using lat and long to access One Call API
    fetch(latLonLkup)
        .then(response => response.json())
        .then(data => {
            var lat = data[0].lat;
            var lon = data[0].lon;

            var searchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${weatherAPI}`;
            console.log(searchUrl);

            fetch(searchUrl)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    cityEl.textContent = city;
                    tempSpan.textContent = data.current.temp;
                    windSpan.textContent = data.current.wind_speed;
                    humSpan.textContent = data.current.humidity;
                    
                    // Setting UV index box colors
                    uvSpan.textContent = data.current.uvi;
                    if (data.current.uvi < 3) { 
                        uvSpan.classList.add("low");
                    } else if (data.current.uvi < 6){
                        uvSpan.classList.add("moderate");
                    } else if (data.current.uvi < 8){
                        uvSpan.classList.add("high");
                    } else if (data.current.uvi < 11){
                        uvSpan.classList.add("very-high");
                    } else{
                        uvSpan.classList.add("extreme");
                    };

                    // Adding url for weather icon
                    var icon = data.daily[0].weather[0].icon;
                    var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
                    weatherIcon.src = iconUrl;

                    for (var index=1; index < 6; index++) {
                        var fCard = document.createElement("div");
                        var fTemp = document.createElement("h3");
                        var fWind = document.createElement("h3");
                        var fHum = document.createElement("h3");
                        var br = document.createElement("br");

                        fCard.innerHTML = "";
                        fTemp.textContent = data.daily[index].temp.day;
                        fWind.textContent = data.daily[index].wind_speed;
                        fHum.textContent = data.daily[index].humidity;

                        fCard.append(fTemp, br, fWind, br, fHum);
                        forecastEl.appendChild(fCard);
                    }

                })
            });
};



    searchForm.addEventListener('submit', searchFormSubmit);

