module.exports = {
  // database connection configs
  db: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_URL || `127.0.0.1`,
      database: 'air_delivery',
    },
    port: 5432,
  },

  // port for server to run on
  express: {
    port: 3001,
  },

  // timestamp format for our logs
  logger: {
    format: 'dddd MMMM Do YYYY, h:mm:ss a',
  },
};
