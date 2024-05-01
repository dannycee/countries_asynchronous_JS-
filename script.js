'use strict';

const getCountryData = function (country) {
  const request = new XMLHttpRequest(); //old school way

  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);

    const html = `
        <div class="country">
            <div class="country__img-container">
                <img class="country__img" src="${data.flags.png}" />
            </div>
            <div class="country__header">
                <h3 class="country__name">${data.name.common}</h3>
                <button class="country__toggle-btn">▼</button>
            </div>
            <div class="country__details">
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(
                  +data.population / 1000000
                ).toFixed(1)} M people</p>
                <p class="country__row"><span>🗣️</span>${Object.values(
                  data.languages
                ).join(', ')}</p>
                <p class="country__row"><span>💰</span>${
                  Object.values(data.currencies)[0].name
                }</p>
            </div>
        </div>
        `;

    document
      .querySelector('.countries-grid')
      .insertAdjacentHTML('beforeend', html);
    document.querySelector('.countries-grid').style.opacity = 1;

    // Znajdujemy przycisk i szczegóły dla ostatniego kraju w gridzie
    const countryButton = document.querySelector(
      '.country:last-child .country__toggle-btn'
    );
    const countryDetails = document.querySelector(
      '.country:last-child .country__details'
    );

    // Przypisujemy obsługę zdarzenia dla przycisku
    countryButton.addEventListener('click', function () {
      // Zmieniamy tekst przycisku na chevron w dół/górę
      this.textContent = countryDetails.style.display === 'none' ? '▼' : '▲';

      // Pokazujemy lub ukrywamy szczegóły w zależności od bieżącego stanu
      countryDetails.style.display =
        countryDetails.style.display === 'none' ? 'block' : 'none';
    });
  });
};

// Wywołanie dla wszystkich krajów
const requestAllCountries = new XMLHttpRequest();
requestAllCountries.open('GET', 'https://restcountries.com/v3.1/all');
requestAllCountries.send();

requestAllCountries.addEventListener('load', function () {
  const countries = JSON.parse(this.responseText);
  countries.forEach(country =>
    getCountryData(country.name.common.toLowerCase())
  );
});
