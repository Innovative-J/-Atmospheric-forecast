const api = "7552a36ea8bdcea72aab04ad4b560dca";
const APIUrl = `http://api.openweathermap.org`;

// let exampleUrl =
//   "http://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=" +
//   api +
//   "&units=imperial";

// fetch(exampleUrl)
//   .then(function (response) {
//     console.log(response);
//     return response.json();
//   })
//   .then(function (data) {
//     console.log("this is data !! === ", data);
//   });

const inputEl = document.querySelector(".user-input");
const formEl = document.querySelector("form");

function handleSubmit(e) {
  e.preventDefault();
  const searchTerm = inputEl.value;

  if (!searchTerm || searchTerm.length < 3) {
    console.log("bad input");
  }

  getCoordinates(searchTerm);

  // const currentDayCoords = data[0];
  // const fiveDayCoords = data;

  // getCurrentDayForecast(currentDayCoords);
  // getFiveDayForecast(fiveDayCoords);
}

function getCoordinates(cityname) {
  // const geoCodeURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchTerm + '&limit=5&appid=' + api;
  // const geoCodeURL = `http://api.openweathermap.org`;
  // const geoCodeURL = 'https://jsonplaceholder.typicode.com/todos';

  fetch(`${APIUrl}/geo/1.0/direct?q=${cityname}&limit=1&appid=${api}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      console.log("This is lat  ===", latitude);
      console.log("This is lon ", longitude);

      getCurrentDayForecast(latitude, longitude);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getCurrentDayForecast(lat, lon) {
  // coords = getCoordinates();

  fetch(
    `${APIUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=imperial`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      console.log("this is temp for today =  ", data.main.temp);
      let currentTempEl = document.getElementById("currentTemp");
      currentTempEl.textContent = data.main.temp;.
      cd ..
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getFiveDayForecast(coords = { lat: " ", lon: " " }) {
  // coords = getCoordinates();
  const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api}`;

  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      return data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function displayCurrentDayForecast(forecast = {}) {
  // forecast = getCurrentDayForecast() ;

  const foreCastElem = document.querySelector("#day-forecast");
  foreCastElem.setAttribute("hidden", false);
  const foreCastItemEl = document.createElement("article");

  for (let i = 0; i < foreCastElem.length; i++) {
    const childEl = foreCastElem[i];
    childEl.textContent = forecast.toString();
  }
}

formEl.addEventListener("submit", handleSubmit);
