/* eslint-disable arrow-body-style */

module.exports = (knex, Place) => {
  return async () => {
    try {
      const stations = await knex('place')
        .where({ type: 'station' })
        .select();
      const stationsList = [];
      stations.forEach((station) => {
        stationsList.push(new Place(station));
      });
      return stationsList;
    } catch (err) {
      throw err;
    }
  };
};
