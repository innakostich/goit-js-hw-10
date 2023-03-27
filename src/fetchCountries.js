export const fetchCountries = (name) => {
    const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 404) {
          throw new Error('Not found');
        }
        return data;
      });
  };