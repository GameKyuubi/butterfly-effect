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
    console.log('hello checkspace', origin, dest);
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
          'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkZW50aWFsX2lkIjoiY3JlZGVudGlhbHwyREp4bE5wQzVleHZRZVVNQkIwTHhTbHBNTW1lIiwiYXBwbGljYXRpb25faWQiOiJhcHBsaWNhdGlvbnw5dzhaS0F2VVc5WUt2eFNCV1lsbEV0dkthbDI1Iiwib3JnYW5pemF0aW9uX2lkIjoiZGV2ZWxvcGVyfFdZV21scGFVbTRvNnBsaDU4RWV2QUhHUkI1WnkiLCJpYXQiOjE0OTk4MjQwNDV9.NJtsnXi4DGDKZDO1DNSmcKvlrVAB50f0ESDXSRZdVa4'
        },
      };

      const response = await (await fetch(`https://api.airmap.jp/airspace/v2/search?${query}`, options)).json();
      isOK = response.data.length === 0;
      console.log('hello inside of the things');
    } catch (err) {
      console.error('Error contacting Airmap API:', err);
    }
    return isOK;
  }
}

module.exports = AirspaceChecker;
