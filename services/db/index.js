/* eslint-disable global-require */
const Knex = require('knex');

module.exports = function (config) {
  const knex = Knex({
    client: config.client,
    port: config.connection.port,
    connection: {
      host: config.connection.host,
      database: config.connection.database,
    },
  });

  return {
    stations: require('./stations')(knex),
  };
};
