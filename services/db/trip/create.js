/* eslint-disable arrow-body-style */
module.exports = (knex, Trip) => {
  return async (params) => {
    try {
      const id = await knex('trip')
        .returning('id')
        .insert({
          tracknum: params.tracknum,
          status: params.status,
        });

      const trips = await knex('trip')
        .where({ id: id[0] })
        .select();
      return new Trip(trips[0]);
    } catch (err) {
      throw err;
    }
  };
};
