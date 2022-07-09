const searchCityEl = document.querySelector("#searchCity");
const searchBtnEl = document.querySelector("#searchBtn");
const cityEl = document.querySelector(".city");
const tempCityEl = document.querySelector(".tempCity");
const windCityEl = document.querySelector(".windCity");
const uvIndexCityEl = document.querySelector(".uvIndexCity");
const humidityCityEl = document.querySelector(".humidityCity");
const apiKey = "77a5068a20d5980953f1461d1eff9181";
const cityIconEl = document.querySelector(`.cityIcon`);
let storageArray = [];
const searchHistoryEl = document.querySelector(".searchHistory");

function getStorage() {
    searchHistoryEl.innerHTML = "";
    const storedCities = JSON.parse(localStorage.getItem("searchedCities"));
    if (!storedCities) return;
    storageArray = storedCities;
    console.log(storedCities);
    storedCities.forEach((city) => {
        const newBtn = document.createElement("button");
        newBtn.innerText = city;
        searchHistoryEl.append(newBtn);
    });
}
async function getLongLat() {
    const cityName = searchCityEl.value;
    searchCityEl.value = "";
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data[0].lat);
    const cityData = { cityName, lat: data[0].lat, lon: data[0].lon };
    getWeather(cityData);
}
async function getWeather(cityData) {
    console.log(cityData);
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityData.lat}&lon=${cityData.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    tempCityEl.innerText = data.current.temp;
    windCityEl.innerText = data.current.wind_speed;
    humidityCityEl.innerText = data.current.humidity;
    uvIndexCityEl.innerText = data.current.uvi;
    const cityIcon = data.current.weather[0].icon;
    cityIconEl.src = `https://openweathermap.org/img/wn/${cityIcon}.png`;
    const date = new Date(data.current.dt * 1000).toLocaleDateString();
    cityEl.innerText = `${cityData.cityName} (${date})`;

    data.daily.forEach((day, i) => {
        if (i > 4) return;
        const cardTempEl = document.querySelector(`.tempCard${i}`);
        const cardWindEl = document.querySelector(`.windCard${i}`);
        const cardHumidityEl = document.querySelector(`.humidityCard${i}`);
        const cardDateEL = document.querySelector(`.dateCard${i}`);
        const date = new Date(day.dt * 1000).toLocaleDateString();
        cardTempEl.innerText = day.temp.day;
        cardWindEl.innerText = day.wind_speed;
        cardHumidityEl.innerText = day.humidity;
        cardDateEL.innerText = date;
        const weatherIconEl = document.querySelector(`.weatherIcon${i}`);
        const currentIcon = day.weather[0].icon;
        weatherIconEl.src = `https://openweathermap.org/img/wn/${currentIcon}.png`;
    });
    storageArray.push(cityData.cityName);
    localStorage.setItem("searchedCities", JSON.stringify(storageArray));
    getStorage();
}
getStorage();
searchBtnEl.addEventListener("click", getLongLat);
