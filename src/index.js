import './styles.css';

const API_KEY = 'cae933781d5722d745027548659cfd71';
let CURRENT_TEMPERATURE_UNIT = '°C';
let CURRENT_WEATHER_INFO_OBJECT;

const getTemperature = (temperature, targetUnit) => {
  if (targetUnit === '°C') {
    return Math.round((temperature - 273.15) * 100) / 100;
  } else if (targetUnit === '°F') {
    return Math.round(((temperature - 273.15) * (9 / 5) + 32) * 100) / 100;
  }
};

const getWeatherData = async (cityName) => {
  const API_REQUEST_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

  showLoadingAnimation();

  const pr = await fetch(API_REQUEST_URL, { mode: 'cors' });
  const res = await pr.json();

  hideLoadingAnimation();

  if (res.cod === '404') {
    return res;
  } else {
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
  }
};

const updateDisplay = (weatherDataObject) => {
  const currentSelectedCity = document.querySelector('#current-selected-city > span');
  const cityPressure = document.querySelector('#city-pressure > span');
  const cityHumidity = document.querySelector('#city-humidity > span');

  currentSelectedCity.textContent = weatherDataObject.city;
  cityPressure.textContent = `${weatherDataObject.pressure} mb`;
  cityHumidity.textContent = `${weatherDataObject.humidity}%`;

  updateTemperatureDisplay(CURRENT_TEMPERATURE_UNIT);
};

const updateTemperatureDisplay = (unit) => {
  const cityTemperature = document.querySelector('#city-temperature > span');
  const cityFeelsLike = document.querySelector('#city-feels_like > span');

  cityTemperature.textContent = getTemperature(parseFloat(CURRENT_WEATHER_INFO_OBJECT.temperature), unit);
  cityTemperature.textContent += ` ${unit}`;
  cityFeelsLike.textContent = getTemperature(parseFloat(CURRENT_WEATHER_INFO_OBJECT.feels_like), unit);
  cityFeelsLike.textContent += ` ${unit}`;
};

const showLoadingAnimation = () => {
  const loadingAnimationSpan = document.querySelector('#loading-animation');
  loadingAnimationSpan.style.display = '';

  const AnimationInterval = setInterval(() => {
    if (loadingAnimationSpan.textContent.match(/\./g).length >= 3) {
      loadingAnimationSpan.textContent = 'Fetching.';
    } else {
      loadingAnimationSpan.textContent += '.';
    }
    if (loadingAnimationSpan.style.display === 'none') {
      loadingAnimationSpan.textContent = 'Fetching.';
      clearInterval(AnimationInterval);
    }
  }, 1000);
};

const hideLoadingAnimation = () => {
  const loadingAnimationSpan = document.querySelector('#loading-animation');
  loadingAnimationSpan.style.display = 'none';
};

const handleSubmitCity = (e) => {
  const cityInput = document.querySelector('#city');
  const cityName = cityInput.value;

  const emptyCityNameErrorSpan = document.querySelector('#empty-city-name-error');
  const cityNotFoundErrorSpan = document.querySelector('#city-not-found-error');

  if (cityName === '') {
    emptyCityNameErrorSpan.style.display = '';
  } else {
    emptyCityNameErrorSpan.style.display = 'none';

    getWeatherData(cityName).then((r) => {
      if (r.cod === '404') {
        cityNotFoundErrorSpan.style.display = '';
      } else {
        cityNotFoundErrorSpan.style.display = 'none';

        CURRENT_WEATHER_INFO_OBJECT = r;

        updateDisplay(r);
      }
    });
  }
};

const handleUpdateSelectedUnit = (e, newUnit) => {
  CURRENT_TEMPERATURE_UNIT = newUnit;
  updateTemperatureDisplay(newUnit);
};

const submitCityButton = document.querySelector('#submit-city');
const celsiusButton = document.querySelector('#celsius-button');
const fahrenheitButton = document.querySelector('#fahrenheit-button');

submitCityButton.addEventListener('click', handleSubmitCity);
celsiusButton.addEventListener('click', (e) => handleUpdateSelectedUnit(e, '°C'));
fahrenheitButton.addEventListener('click', (e) => handleUpdateSelectedUnit(e, '°F'));
