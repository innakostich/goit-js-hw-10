import './css/styles.css';
import './css/new.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const renderCountryList = (countries) => {
  countryList.innerHTML = '';
  countries.forEach((country) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="50"> ${country.name.common}`;
    countryList.appendChild(listItem);
  });
};

const renderCountryInfo = (country) => {
  const languages = Object.values(country.languages).join(', ');
  countryInfo.innerHTML = `
    <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">
    <h2>${country.name.common}</h2>
    <p>Capital: ${country.capital[0]}</p>
    <p>Population: ${country.population}</p>
    <p>Languages: ${languages}</p>
  `;
};

const onInput = debounce((event) => {
  const searchTerm = event.target.value.trim();
  if (searchTerm === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(searchTerm)
    .then((countries) => {
      if (countries.length > 10) {
        Notify.warning('Too many matches found. Please enter a more specific name.');
      } else if (countries.length > 1) {
        renderCountryList(countries);
        countryInfo.innerHTML = '';
      } else {
        renderCountryInfo(countries[0]);
        countryList.innerHTML = '';
      }
    })
    .catch((error) => {
      Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}, DEBOUNCE_DELAY);

searchBox.addEventListener('input', onInput);
