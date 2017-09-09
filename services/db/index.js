/* eslint-disable global-require */
/* eslint-disable func-names */
const Knex = require('knex');

module.exports = (config) => {
  const knex = Knex({
    client: config.client,
    port: config.connection.port,
    connection: {
      host: config.connection.host,
      database: config.connection.database,
    },
  });

  return {
    place: require('./place')(knex),
    trip: require('./trip')(knex),
    segment: require('./segment')(knex),
    telemetry: require('./telemetry')(knex),
  };
};
