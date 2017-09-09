const fetch = require('isomorphic-fetch');

const getRoute = async (route) => {
  try {
    const params = {
      route,
    };

    const response = await (await fetch('/api/routes', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    })).json();

    return response;
  } catch (err) {
    return { status: 'error', message: 'Error occured while fetching from API.' };
  }
};

export default getRoute;
