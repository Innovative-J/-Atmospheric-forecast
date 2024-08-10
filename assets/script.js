const APIKey = '7552a36ea8bdcea72aab04ad4b560dca';
const historyContainer = $('#search-history');
const DATES = getDates();

// Search form submission
function handleQuery(event) {
    event.preventDefault();
    let city = $('#city-input').val().trim();
    $('#city-input').val('');
    console.log(`Searching for city: ${city}`); // Debugging line
    fetchRequest(city, false);
}

// Parsing forecast data 
function parseForecastData(data) {
    let forecastData = [];
    for (let i = 0; i < data.list.length; ++i) {
        let weather;
        for (let j = 0; j < DATES.length; ++j) {
            let timestamp = dayjs.unix(data.list[i].dt).format('MM/DD/YYYY-HH');
            if (DATES[j] + '-13' === timestamp) {
                weather = {
                    date: dayjs.unix(data.list[i].dt).format('M/D/YYYY'),
                    temp: data.list[i].main.temp,
                    wind: data.list[i].wind.speed,
                    humidity: data.list[i].main.humidity,
                    weatherIcon: data.list[i].weather[0].icon
                };
                forecastData.push(weather);
            }
        }
    }
    console.log('Parsed forecast data:', forecastData); // Debugging line
    return forecastData;
}


// Forecast display data
function displayForecast(data) {
    let forecastData = parseForecastData(data);
    for (let i = 0; i < 5; ++i) {
        $(`#forecast-date-${i+1}`).text(`${forecastData[i].date}`);
        $(`#forecast-icon-${i+1}`).attr('src', `https://openweathermap.org/img/wn/${forecastData[i].weatherIcon}@2x.png`);
        $(`#forecast-temp-${i+1}`).text(`Temp: ${forecastData[i].temp} °F`);
        $(`#forecast-wind-${i+1}`).text(`Wind: ${forecastData[i].wind} MPH`);
        $(`#forecast-humidity-${i+1}`).text(`Humidity: ${forecastData[i].humidity} %`);
    }
}

function parseWeatherData(data) {
    return {
        date: dayjs.unix(data.dt).format('M/D/YYYY'),
        temp: data.main.temp,
        wind: data.wind.speed,
        humidity: data.main.humidity,
        weatherIcon: data.weather[0].icon
    };
}

// Current weather display
function displayWeather(data, city) {
    let weatherData = parseWeatherData(data);
    $('#city-name').text(`${city} (${weatherData.date})`);
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${weatherData.weatherIcon}@2x.png`);
    $('#temperature').text(`Temp: ${weatherData.temp} °F`);
    $('#wind-speed').text(`Wind Speed: ${weatherData.wind} MPH`);
    $('#humidity').text(`Humidity: ${weatherData.humidity} %`);
}
// forecast fetch data from api
function fetchRequest(city, render) {
    let urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;

    fetch(urlWeather).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log('Weather data:', data); // Debugging line
                if (!render) addToHistory(city);
                displayWeather(data, city);
            });
        } else {
            console.error('Weather response error:', response.statusText); 
        }
    }).catch(function (error) {
        console.error('Weather fetch error:', error); // Debugging line
    });

    fetch(urlForecast).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log('Forecast data:', data); // Debugging line
                displayForecast(data);
            });
        } else {
            console.error('Forecast response error:', response.statusText); // Debugging line
        }
    }).catch(function (error) {
        console.error('Forecast fetch error:', error); // Debugging line
    });
}

// Adding search and creating history
function addToHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
    searchHistory.push(city);
    if (searchHistory.length > 10) {
        searchHistory.shift();
    }
    localStorage.setItem("history", JSON.stringify(searchHistory));
    createHistoryItem(city);
}

function createHistoryItem(city) {
    let card = $('<div class="card my-1 mx-3 text-center history-card"></div>');
    let cardBody = $('<div class="card-body p-1"></div>');
    cardBody.append($(`<p class="m-0">${city}</p>`));
    card.append(cardBody);
    historyContainer.prepend(card);
}

function renderHistory() {
    let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
    searchHistory.forEach(city => createHistoryItem(city));
}

function renderDashboard() {
    let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
    if (searchHistory.length > 0) {
        let lastCity = searchHistory[searchHistory.length - 1];
        fetchRequest(lastCity, true);
    }
}

function getDates() {
    let dates = [];
    for (let i = 0; i < 6; ++i) {
        dates.push(dayjs().add(i, 'day').format('MM/DD/YYYY'));
    }
    return dates;
}

$(document).ready(function () {
    renderHistory();
    renderDashboard();
    $('#search-button').on('click', handleQuery);
});
