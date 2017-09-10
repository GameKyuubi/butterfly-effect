/* eslint-disable arrow-body-style */

module.exports = (knex, Place) => {
  return async (id) => {
    try {
      const place = await knex('place')
        .where({ id })
        .select();
      return new Place(place);
    } catch (err) {
      throw err;
    }
  };
};
