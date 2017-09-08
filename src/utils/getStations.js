const fetch = require('isomorphic-fetch');

const getStations = async () => {
  try {
    const response = await (await fetch('/api/stations')).json();
    return response;
  } catch (err) {
    return { status: 'error', message: 'Error occured while fetching from API.' };
  }
};

export default getStations;
