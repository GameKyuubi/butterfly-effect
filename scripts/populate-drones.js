// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable no-console */
/* eslint-disable padded-blocks */
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL || `postgres://${process.env.USER}@127.0.0.1:5432/air_delivery`,
  searchPath: 'public',
});

(async () => {
  try {
    const insertDrone = item =>
      db('drone').insert(item)
        .then(res => res)
        .catch(err => console.error('Error creating drone', err));
    const insertTelemetry = item =>
      db('telemetry').insert(item)
        .then(res => res)
        .catch(err => console.error('Error creating drone', err));

    let droneIds = [];
    while(droneIds.length < 1000) droneIds.push(droneIds.length);
    
    const dronePromises = droneIds.map((id) => {
      return insertDrone({
        id,
        flytime: 1200000,
        speed: 10,
      });
    });

    const telemetryPromises = droneIds.map((id) => {
      return insertTelemetry({
        latitude: 35.6895,
        longitude: 139.6917,
        charge: 100,
        drone_id: id,
        status: 'ready',
      });
    });

    await Promise.all(dronePromises);
    await Promise.all(telemetryPromises);

  } catch (err) {
    console.error('Error updating records', err);
  }
  console.log('All done!');
  process.exit();
})();
