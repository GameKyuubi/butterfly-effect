/* eslint-disable arrow-body-style */
module.exports = (knex, Telemetry) => {
  return async (droneId) => {
    try {
      const telemetrys = await knex('telemetry')
        .where({ drone_id: droneId })
        .select();
      return new Telemetry(telemetrys[0]);
    } catch (err) {
      throw err;
    }
  };
};
