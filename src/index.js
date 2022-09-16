import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const refs = {
  searchForm: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.searchForm.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);



function onInputChange() {
  const name = refs.searchForm.value.trim();
  if (name === '') {
    return (
      (refs.countryListEl.innerHTML = ''), (refs.countryInfoEl.innerHTML = '')
    );
  }

  fetchCountries(name)
    .then(response => {
      refs.countryListEl.innerHTML = '';
      refs.countryInfoEl.innerHTML = '';

      if (response.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (response.length < 10 && response.length >= 2) {
        refs.countryListEl.insertAdjacentHTML(
          'beforeend',
          renderCountryList(response)
        );
      } else {
        refs.countryInfoEl.insertAdjacentHTML(
          'beforeend',
          renderCountryInfo(response)
        );
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      return [];
    });
}

function renderCountryList(countries) {
  return countries
    .map(({ flags, name }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 50px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
}

function renderCountryInfo(countries) {
  return countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
     
        <ul class="country-info__list">
 
            <li class="country--info__item">
                <p>
                    <img width="70px" height="50px" src='${flags.svg}' alt='${name.official} flag' /><span class ="countryName">
                    ${name.official}</span>
                </p>
            </li>
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages)}</p></li>
        </ul>
        `;
    })
    .join('');
}
