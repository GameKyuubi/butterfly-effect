const setup = knex =>
  knex.schema.createTable('place', (t) => {
    t.increments().index();
    t.decimal('latitude', 12, 8);
    t.decimal('longitude', 12, 8);
    t.enu('type', ['origin', 'destinition', 'station']);
  });

const rollback = knex =>
  knex.schema.dropTable('place');

exports.up = setup;
exports.down = rollback;
