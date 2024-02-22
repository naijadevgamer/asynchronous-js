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

// New way
const getCountryAndNeighbourNew = function (country) {
  // Country 1
  fetch('https://restcountries.com/v3.1/name/' + country)
    .then(response => response.json())
    .then(([data]) => {
      renderCountry(data);
      const [neighbour] = data.borders;
      if (!neighbour) return;
      // Country 2
      return fetch('https://restcountries.com/v3.1/alpha/' + neighbour);
    })
    .then(response => response.json())
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
  getCountryAndNeighbourNew('nigeria');
});
