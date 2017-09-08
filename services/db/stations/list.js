/* eslint-disable arrow-body-style */

module.exports = (knex, Station) => {
  return async () => {
    try {
      const stations = await knex('place')
        .where({ type: 'station' })
        .select();
      const stationsList = [];
      stations.forEach((station) => {
        stationsList.push(new Station(station));
      });
      return stationsList;
    } catch (err) {
      throw err;
    }
  };
};
