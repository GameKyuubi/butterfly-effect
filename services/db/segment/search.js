/* eslint-disable arrow-body-style */
module.exports = (knex, Segment) => {
  return async (tripId) => {
    try {
      const segments = await knex('segment')
        .where({ trip_id: tripId })
        .select();
      const segmentsList = [];
      segments.forEach((segment) => {
        segmentsList.push(new Segment(segment));
      });
      return segmentsList;
    } catch (err) {
      throw err;
    }
  };
};
