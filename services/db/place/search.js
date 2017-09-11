/* eslint-disable arrow-body-style */

module.exports = (knex, Place) => {
  return async (id) => {
    console.log('Searching for place by id:', id);
    try {
      const place = await knex('place')
        .where({ id })
        .select();
      return new Place(place[0]);
    } catch (err) {
      throw err;
    }
  };
};
