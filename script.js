var recentSearchEl = document.querySelector("#recent-search");
var forcastEl = document.querySelector("#five-day-forecast");
var weatherEl = document.querySelector("#weather-container");
var searchInputEl = document.querySelector("#city-searched");
var cityEl = document.querySelector("#recent-search");
var citiesEl = document.querySelector("#city");

var storeSearch = function(){
    localStorage.setItem("cities", JSON.stringfy(cities));
}

var inputSubmit = function(event) {
    event.preventDefault();
    var city = cityEl.value.trim();
    if(city){
        getWeather(city);
        getForecast(city);
        cityEl.value = "";
    } 
    storeSearch();
    recentSearch(city);
}

getWeather = functon(city){
    var apikey = "692b89abf2c18359c1ee72aa48703fa6"
    var api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(api)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data,city);
        });
    });
};

var showWeather = function(weather,searchedCity){
    weatherEl.textContent = "";
    searchInputEl.textContent = searchedCity;
}

var temperatureEl = document.createElement("span")
temperatureEl.textContent = "Temperature" + weather.main.temp

var date = document.createElement("span")
date.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
searchInputEl.appendChild(date)

var humidity = documant.createElement