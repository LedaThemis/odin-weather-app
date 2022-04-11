import './styles.css';

const CITY_NAME = 'Mosul';
const API_KEY = 'cae933781d5722d745027548659cfd71';

const getWeatherData = async (cityName) => {
  const API_REQUEST_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  const pr = await fetch(API_REQUEST_URL, { mode: 'cors' });
  const res = await pr.json();
  console.log(res);
  return {
    temperature: res.main.temp,
    feels_like: res.main.feels_like,
    pressure: res.main.pressure,
    humidity: res.main.humidity,
    city: res.name,
    dt: res.dt,
    sunrise: res.sys.sunrise,
    sunset: res.sys.sunset,
    status: res.weather[0].main,
  };
};

const updateDisplay = (weatherDataObject) => {
  const currentSelectedCity = document.querySelector('#current-selected-city > span');
  const cityTemperature = document.querySelector('#city-temperature > span');
  const cityFeelsLike = document.querySelector('#city-feels_like > span');
  const cityPressure = document.querySelector('#city-pressure > span');
  const cityHumidity = document.querySelector('#city-humidity > span');

  currentSelectedCity.textContent = weatherDataObject.city;
  cityTemperature.textContent = weatherDataObject.temperature;
  cityFeelsLike.textContent = weatherDataObject.feels_like;
  cityPressure.textContent = weatherDataObject.pressure;
  cityHumidity.textContent = weatherDataObject.humidity;
};

getWeatherData(CITY_NAME).then((res) => updateDisplay(res));
