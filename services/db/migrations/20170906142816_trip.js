const setup = knex =>
  knex.schema.createTable('trip', (t) => {
    t.increments().index();
    t.integer('tracknum');
    t.enu('status', ['valid', 'invalid']);
  });

const rollback = knex =>
  knex.schema.dropTable('trip');

exports.up = setup;
exports.down = rollback;
