const fetch = require('isomorphic-fetch');

const track = async (trackingNumber) => {
  try {
    const params = {
      trackingNumber
    };

    const response = await (await fetch('/api/track', {
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

export default track;
