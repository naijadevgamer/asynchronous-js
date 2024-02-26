'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  // converts languages value to array
  const languages =
    data.languages !== undefined ? Object.values(data.languages) : '';

  // converts currencies value to array
  const currencies =
    data.currencies !== undefined ? Object.values(data.currencies) : '';
  const html = `
    <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${languages[0]}</p>
      <p class="country__row"><span>💰</span>${currencies[0].name}</p>
      </div>
      </article>
      `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

// Old school way
const getCountryAndNeighbourOld = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', 'https://restcountries.com/v3.1/name/' + country);
  console.log(request);
  request.send();
  console.log(request.responseText);
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    renderCountry(data);

    // Get neighbour country border
    const [neighbour] = data.borders;

    if (!neighbour) return;

    // AJAX call country 2
    // Callback hell
    const request2 = new XMLHttpRequest();
    request2.open('GET', 'https://restcountries.com/v3.1/alpha/' + neighbour);
    request2.send();
    request2.addEventListener('load', function () {
      const [data] = JSON.parse(this.responseText);
      renderCountry(data, 'neighbour');
    });
  });
};

// getCountryAndNeighbourOld('usa');

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(errorMsg);
    return response.json();
  });
};

// New way
const getCountryAndNeighbourNew = function (country) {
  // Country 1
  getJSON('https://restcountries.com/v3.1/name/' + country, 'Country not found')
    .then(([data]) => {
      renderCountry(data);
      if (!data.borders) throw new Error('Country is borderless');
      const [neighbour] = data.borders;
      // Country 2
      return getJSON(
        'https://restcountries.com/v3.1/alpha/' + neighbour,
        'Country not found'
      );
    })
    .then(([data]) => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 📛📛📛`);
      renderError(`Something went wrong 📛📛📛 ${err.message}. Try again`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryAndNeighbourNew('madagascar');
});

// 1
const whereAmI = function (lat, lng) {
  // 2

  fetch(`https://geocode.xyz/${lat},${lng}?json=1`)
    .then(res => res.json())
    .then(data => {
      // 5
      if (!data.country) throw new Error('You have exceeded the request limit');
      // 3
      console.log(`You are in ${data.city}, ${data.country}`);
      // 6 & 7
      getCountryAndNeighbourNew(data.country);
    }) // 4
    .catch(err => {
      renderError(`${err.message} 📛📛📛`);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition.then(res => console.log(res));

// Promisifying the geolocation  api
// btn.addEventListener("click", function () {
//   whereAmI();
// });
