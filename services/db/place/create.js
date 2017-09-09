/* eslint-disable arrow-body-style */
module.exports = (knex, Place) => {
  return async (params) => {
    try {
      const id = await knex('place')
        .returning('id')
        .insert({
          type: params.type,
          latitude: params.latitude,
          longitude: params.longitude,
        });

      const places = await knex('place')
        .where({ id: id[0] })
        .select();
      return new Place(places[0]);
    } catch (err) {
      throw err;
    }
  };
};
