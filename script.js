var apikey = "692b89abf2c18359c1ee72aa48703fa6";
var searchedCity = "";
var recentCity = "";

var getWeatherforecast = (event) => {
    var city = $('#search-city').val();
    
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + apikey;
   
    fetch(queryURL)
        .then (handleErrors)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
        
        var fiveDayForecastHTML = `
        <h2>5-Day Forecast:</h2>
        <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
       
        for (var i = 0; i < response.list.length; i++) {
            var dayData = response.list[i];
            var dayTimeUTC = dayData.dt;
            var timeZone = response.city.timezone;
            var timeZoneHours = timeZone / 60 / 60;
            var moments = moment.unix(dayTimeUTC).utc().utc(timeZoneHours);
            var weatherIconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
            
            if (moments.format("HH:mm:ss") === "11:00:00" || moments.format("HH:mm:ss") === "12:00:00" || moments.format("HH:mm:ss") === "13:00:00") {
                fiveDayForecastHTML += `
                <div class="weather-card card m-2 p0">
                    <ul class="list-unstyled p-3">
                        <li>${moments.format("MM/DD/YY")}</li>
                        <li class="weather-icon"><img src="${weatherIconURL}"></li>
                        <li>Temp: ${dayData.main.temp}&#8457;</li>
                        <br>
                        <li>Humidity: ${dayData.main.humidity}%</li>
                    </ul>
                </div>`;
            }
        }
        
        fiveDayForecastHTML += `</div>`;
       
        $('#five-day-forecast').html(fiveDayForecastHTML);
    })
}

var getWeatherConditions = (event) => {
   
    var city = $('#search-city').val();
    searchedCity= $('#search-city').val();
   
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + apikey;
    fetch(queryURL)
    .then(handleErrors)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        
        storecity(city);
        $('#search-error').text("");
    
        var weatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

        var currentTimeUTC = response.dt;
        var currentTimeZone = response.timezone;
        var currentTimeZoneHours = currentTimeZone / 60 / 60;
        var currentMoment = moment.unix(currentTimeUTC).utc().utc(currentTimeZoneHours);
      
        renderCities();
     
        getWeatherforecast(event);
   
        $('#header-text').text(response.name);
    
        var weatherHTML = `
            <h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${weatherIcon}"></h3>
            <ul class="list-unstyled">
                <li>Temperature: ${response.main.temp}&#8457;</li>
                <li>Humidity: ${response.main.humidity}%</li>
                <li>Wind Speed: ${response.wind.speed} mph</li>
                <li id="uvIndex">UV Index:</li>
            </ul>`;
        
        $('#current-weather').html(weatherHTML);

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvIndexURL = "api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&APPID=" + apikey;
     
        uvIndexURL = "https://cors-anywhere.herokuapp.com/" + uvIndexURL;
       
        fetch(uvIndexURL)
        .then(handleErrors)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            var uvIndex = response.value;
            $('#uvIndex').html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
            if (uvIndex>=0 && uvIndex<3){
                $('#uvVal').attr("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                $('#uvVal').attr("class", "uv-moderate");
            } else if (uvIndex>=8){
                $('#uvVal').attr("class", "uv-severe");
            }
        });
    })
}

var storecity = (newCity) => {
    var cityKnown = false;
    
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === newCity) {
            cityKnown = true;
            break;
        }
    }
    
    if (cityKnown === false) {
        localStorage.setItem('cities' + localStorage.length, newCity);
    }
}


var renderCities = () => {
    $('#search-results').empty();
    
    if (localStorage.length===0){
        if (recentCity){
            $('#search-city').attr("value", recentCity);
        } else {
            $('#search-city').attr("value", "");
        }
    } else {
        
        var recentCityKey="cities"+(localStorage.length-1);
        recentCity=localStorage.getItem(recentCityKey);
        
        $('#search-city').attr("value", recentCity);
        
        for (var i = 0; i < localStorage.length; i++) {
            var city = localStorage.getItem("cities" + i);
            var cityEl;
           
            if (searchedCity===""){
                searchedCity=recentCity;
            }

            if (city === searchedCity) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
            } 
           
            $('#search-results').prepend(cityEl);
        }
        
        if (localStorage.length>0){
            $('#clear-search').html($('<a id="clear-search" href="#">clear</a>'));
        } else {
            $('#clear-search').html('');
        }
    }
    
}

var handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

$('#search-button').on("click", (event) => {
event.preventDefault();
currentCity = $('#search-city').val();
getWeatherConditions(event);
});

$('#search-results').on("click", (event) => {
    event.preventDefault();
    $('#search-city').val(event.target.textContent);
    currentCity=$('#search-city').val();
    getWeatherConditions(event);
});

$("#clear-search").on("click", (event) => {
    localStorage.clear();
    renderCities();
});


renderCities();


getWeatherConditions();



