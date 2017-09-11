/* eslint-disable no-console */

require('dotenv').config();
const querystring = require('querystring');
const fetch = require('isomorphic-fetch');

class AirspaceChecker {
  /**
   * Determines if the drone is allowed to fly on this flight path
   * 
   * @param {*} origin Array of 2 values: latitude & longitude
   * @param {*} destination Array of 2 values: latitude & longitude
   * @returns {boolean} True if the drone can fly on this segment, false if not
   */
  static async checkSpace(origin, dest) {
    let isOK;

    try {
      const params = {
        geometry: `{ "type": "LineString", "coordinates": [[${origin[1]}, ${origin[0]}], [${dest[1]}, ${dest[0]}]] }`,
        types: 'airport',
        geometry_format: 'geojson',
        full: true,
        buffer: 3,
      };
      const query = querystring.stringify(params);
      const options = {
        headers: {
          'x-api-key': process.env.AIRMAP_API_KEY
        },
      };
      const response = await (await fetch(`https://api.airmap.jp/airspace/v2/search?${query}`, options)).json();
      isOK = response.data.length === 0;
    } catch (err) {
      console.error('Error contacting Airmap API:', err);
    }
    return isOK;
  }
}

module.exports = AirspaceChecker;
