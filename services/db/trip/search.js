/* eslint-disable arrow-body-style */
module.exports = (knex, Trip) => {
  return async (tracknum) => {
    try {
      const trips = await knex('trip')
        .where({ tracknum })
        .select();

      return new Trip(trips[0]);
    } catch (err) {
      throw err;
    }
  };
};
