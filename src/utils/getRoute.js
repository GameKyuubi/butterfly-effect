const fetch = require('isomorphic-fetch');

const getLngLat = async (address) => {
  try {
    const res = await (await fetch(`http://maps.googleapis.com/maps/api/geocode/json?address="${address}"`)).json();
    if (res.status === 'OK' && res.results.length > 0) {
      const location = res.results[0].geometry.location;
      return Object.assign(location, { status: 'success' });
    }
    return { status: 'error', message: 'Could not find address.' };
  } catch (err) {
    return { status: 'error', message: 'Error occured while fetching from API.' };
  }
};

const getRoute = async (from, dest) => {
  try {
    const cords = await Promise.all([getLngLat(from), getLngLat(dest)]);
    if (cords[0].status === 'error' || cords[1].status === 'error') {
      return { status: 'error', message: 'Could not find location.', path: [] };
    }
    const params = {
      from: {
        lat: cords[0].lat,
        lng: cords[0].lng,
      },
      dest: {
        lat: cords[1].lat,
        lng: cords[1].lng,
      },
    };

    const response = await (await fetch('/api/calculate', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    })).json();
    response.status = 'ok';
    return response;
  } catch (err) {
    return { status: 'error', message: 'Error occured while fetching from API.', path: [] };
  }
};

export default getRoute;
