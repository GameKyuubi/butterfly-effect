// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable no-console */
/* eslint-disable padded-blocks */
/* eslint-disable no-mixed-operators */

const fs = require('fs');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL || `postgres://${process.env.USER}@127.0.0.1:5432/air_delivery`,
  searchPath: 'public',
});

const distance = (a, b) => {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(a.lat - b.lat);
  const dLng = deg2rad(a.lng - b.lng);
  const A = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(a.lat)) * Math.cos(deg2rad(b.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * C; // Distance in km
};

const tokyo = { lat: 35.6895, lng: 139.6917 };

(async () => {
  try {
    const result = await new Promise((resolve, reject) => {
      fs.readFile('../data/station-cords.json', 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const stations = JSON.parse(result);

    const insert = item =>
      db('place').insert(item)
        .then(res => res)
        .catch(err => console.error('Error inserting station location', err));

    const promises = stations
      .filter(station => distance(tokyo, station) < 15)
      .map((station) => {
        const item = {};
        item.latitude = station.lat;
        item.longitude = station.lng;
        item.type = 'station';
        if (item.longitude !== 0 && item.latitude !== 0) {
          return insert(item);
        }
        return null;
      });

    await Promise.all(promises);

  } catch (err) {
    console.error('Error updating records', err);
  }
  console.log('All done!');
  process.exit();
})();
