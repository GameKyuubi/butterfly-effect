/* eslint-disable arrow-body-style */
module.exports = (knex, Segment) => {
  return async (params) => {
    try {
      const id = await knex('segment')
        .returning('id')
        .insert({
          source_id: params.source_id,
          des_id: params.des_id,
          trip_id: params.trip_id,
          drone_id: params.drone_id,
          status: params.status,
        });

      const places = await knex('segment')
        .where({ id: id[0] })
        .select();
      return new Segment(places[0]);
    } catch (err) {
      throw err;
    }
  };
};
