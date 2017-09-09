/* eslint-disable func-names */
/* eslint-disable global-require */
/* eslint-disable arrow-body-style */

const Trip = function (dbTrip) {
  this.id = dbTrip.id;
  this.tracknum = dbTrip.tracknum;
  this.status = dbTrip.status;
};

module.exports = (knex) => {
  return {
    create: require('./create')(knex, Trip),
    search: require('./search')(knex, Trip),
  };
};

