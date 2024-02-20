'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data) {
  // converts languages value to array
  const languages =
    data.languages !== undefined ? Object.values(data.languages) : '';

  // converts currencies value to array
  const currencies =
    data.currencies !== undefined ? Object.values(data.currencies) : '';
  const html = `
    <article class="country">
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
  countriesContainer.style.opacity = 1;
};

// Old school way
const getCountryAndNeighbour = function (country) {
  const request = new XMLHttpRequest();

  request.open('GET', 'https://restcountries.com/v3.1/name/' + country);

  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    renderCountry(data);

    // Get neigbour country
    const [neigbour] = data.borders;

    if (!neigbour) return;

    //AJAX call country 2
    const request2 = new XMLHttpRequest();

    request.open(
      'GET',
      'https://restcountries.com/v3.1/alpha/{code}' + neigbour
    );

    request.send();
    request.addEventListener('load', function () {
      const [data] = JSON.parse(this.responseText);
      renderCountry(data);
    });
  });
};

getCountryAndNeighbour('nigeria');
