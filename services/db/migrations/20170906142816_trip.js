const setup = knex =>
  knex.schema.createTable('trip', (t) => {
    t.increments().index();
    t.text('tracknum').unique();
    t.enu('status', ['inprogress', 'completed']);
  });

const rollback = knex =>
  knex.schema.dropTable('trip');

exports.up = setup;
exports.down = rollback;
