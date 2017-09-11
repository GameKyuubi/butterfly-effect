// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable no-console */
/* eslint-disable padded-blocks */
const fs = require('fs');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: `postgres://jtxdganycxtmgp:b5404bc10ef9c9987889ad723187b170e6ff9a180f4a06505b6ed3f0c0ba350c@ec2-23-21-85-76.compute-1.amazonaws.com:5432/dduuf6lhuoois8`,
  searchPath: 'public',
});

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

    const promises = stations.map((station) => {
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
