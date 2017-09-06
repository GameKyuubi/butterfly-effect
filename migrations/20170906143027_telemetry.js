exports.up = function (knex) {
  return knex.schema.createTable('telemetry', (t) => {
    t.decimal('latitude', 12, 8);
    t.decimal('longitude', 12, 8);
    t.integer('charge');
    t.integer('drone_id').unsigned().primary();
    t.foreign('drone_id').references('drone.id');
    t.enu('status', ['ready', 'incharge', 'flying', 'out-of-service']);
  });
};
exports.down = function (knex) {
  return knex.schema.dropTable('telemetry');
};
