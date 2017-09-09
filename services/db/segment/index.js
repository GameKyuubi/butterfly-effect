/* eslint-disable func-names */
/* eslint-disable global-require */
/* eslint-disable arrow-body-style */

const Segment = function (dbSegment) {
  this.id = dbSegment.id;
  this.source_id = dbSegment.source_id;
  this.des_id = dbSegment.des_id;
  this.trip_id = dbSegment.trip_id;
  this.drone_id = dbSegment.drone_id;
  this.status = dbSegment.status;
};

module.exports = (knex) => {
  return {
    create: require('./create')(knex, Segment),
    search: require('./search')(knex, Segment),
  };
};

