// UI
// data
// localStorage
// single responsibility principle
//name, main:{temparature, pressure, humidity}, weather[0].icon, weather[0].description

const storage = {
  country: "",
  city: "",
  saveItem() {
    localStorage.setItem("Ind-country", this.country);
    localStorage.setItem("Ind-city", this.city);
  },
  getItem() {
    const country = localStorage.getItem("Ind-country", this.country);
    const city = localStorage.setItem("Ind-city", this.city);

    return { country, city };
  },
};
const weatherData = {
  country: "",
  city: "",
  API_KEY: "314872469278b8dbb6dee35d93197815",

  async getWeather() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`
      );
      const { name, main, weather } = await res.json();
      return {
        name,
        main,
        weather,
      };
    } catch (err) {
      UI.showMessage("Error in fetching data");
    }
  },
};

//=========== UI part ================//
const UI = {
  loadSelectors() {
    const cityElm = document.querySelector("#city");
    const cityInfoElm = document.querySelector("#w-city");
    const iconElm = document.querySelector("#w-icon");
    const temparatureElm = document.querySelector("#w-temp");
    const pressureElm = document.querySelector("#w-pressure");
    const humidityElm = document.querySelector("#w-humidity");
    const feelElm = document.querySelector("#w-feel");
    const formElm = document.querySelector("#form");
    const countryElm = document.querySelector("#country");
    const messageElm = document.querySelector("#messageWrapper");

    return {
      cityElm,
      cityInfoElm,
      iconElm,
      temparatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      formElm,
      countryElm,
      messageElm,
    };
  },

  hideMessage() {
    const messageElm = document.querySelector("#message");
    setTimeout(() => {
      messageElm.remove();
    }, 2000);
  },
  showMessage(msg) {
    const { messageElm } = this.loadSelectors();
    const elm = `<div class="alert alert-danger" id="message">${msg}</div>`;
    messageElm.insertAdjacentHTML("afterbegin", elm);

    this.hideMessage();
  },
  validateInputs(country, city) {
    // validation check
    if (country === "" || city === "") {
      this.showMessage("Please provide necessary information");
      return true;
    } else {
      return false;
    }
  },
  getInputValues() {
    const { countryElm, cityElm } = this.loadSelectors();

    // get the result
    // if result is false (not right) you should stop here

    const isInvalid = this.validateInputs(countryElm.value, cityElm.value);

    if (isInvalid) {
      return;
    }
    return {
      country: countryElm.value,
      city: cityElm.value,
    };
  },

  resetInputs() {
    const { countryElm, cityElm } = this.loadSelectors();
    countryElm.value = "";
    cityElm.value = "";
  },
  async handleRemoteData() {
    const data = await weatherData.getWeather();
    return data;
  },

  getIcon(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  },
  populateUI(data) {
    const {
      cityElm,
      cityInfoElm,
      iconElm,
      temparatureElm,
      pressureElm,
      humidityElm,
      feelElm,
    } = this.loadSelectors();

    const {
      name,
      main: { temp, humidity, pressure },
      weather,
    } = data;

    cityInfoElm.textContent = name;
    temparatureElm.textContent = `Temparature: ${temp}°C`;
    pressureElm.textContent = `Pressure: ${humidity}kpa`;
    humidityElm.textContent = `Humidity: ${pressure}kpa`;
    feelElm.textContent = weather[0].description;
    iconElm.setAttribute("src", this.getIcon(weather[0].icon));
  },

  setDataToStorage(country, city) {
    storage.country = country;
    storage.city = city;
  },
  init() {
    const { formElm } = this.loadSelectors();
    formElm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // get iput values
      // const data = this.getInputValues();
      // const data = this.getInputValues();

      const inputsData = this.getInputValues();
      if (!inputsData) {
        return;
      }
      const { country, city } = inputsData;

      // setting data to temp data layer
      weatherData.country = country;
      weatherData.city = city;

      // setting data into localStorage objcet
      this.setDataToStorage(country, city);
      // saving to storage
      storage.saveItem();

      //reset input values
      console.log(country, city);
      this.resetInputs();

      // send data to API server
      const data = await this.handleRemoteData();

      //populate UI

      this.populateUI(data);
      console.log(data);
    });

    window.addEventListener("DOMContentLoaded", async () => {
      let { country, city } = storage.getItem();
      if (!city || !country) {
        city = "Kolkata";
        country = "India";
      }
      weatherData.city = city;
      weatherData.country = country;

      // send data to API server
      const data = await this.handleRemoteData();

      //populate UI

      this.populateUI(data);
    });
  },
};

UI.init();
