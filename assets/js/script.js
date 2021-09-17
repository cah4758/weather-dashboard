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

    var searchUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${weatherAPI}` ;
    console.log(searchUrl);

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            cityEl.textContent = data.city.name;
            todayEl.textContent = data.list[0].dt_txt;
            weatherIcon.innerHTML = data.list[0].weather[0].icon;
            tempSpan.textContent = data.list[0].main.temp;
            windSpan.textContent = data.list[0].wind.speed;
            humSpan.textContent = data.list[0].main.humidity;
            

            for (var index=1; index < 6; index++) {

            }
            return (data.results.map(item =>(
                cityEl.textContent = city.name
            )))
    });
}


searchForm.addEventListener('submit', searchFormSubmit)
