const setup = knex =>
  knex.schema.createTable('station_drone', (t) => {
    t.integer('drone_id').unsigned();
    t.foreign('drone_id').references('drone.id');
    t.integer('station_id').unsigned();
    t.foreign('station_id').references('place.id');
    t.primary(['station_id', 'drone_id']);
  });

const rollback = knex =>
  knex.schema.dropTable('station_drone');

exports.up = setup;
exports.down = rollback;
