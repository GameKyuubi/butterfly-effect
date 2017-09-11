/* eslint-disable func-names */
/* eslint-disable global-require */
/* eslint-disable arrow-body-style */

const Place = function (dbPlace) {
  this.id = dbPlace.id;
  this.latitude = dbPlace.latitude;
  this.longitude = dbPlace.longitude;
  this.type = dbPlace.type;
};

module.exports = (knex) => {
  return {
    list: require('./list')(knex, Place),
    create: require('./create')(knex, Place),
    search: require('./search')(knex, Place),
  };
};

