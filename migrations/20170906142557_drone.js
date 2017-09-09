const setup = knex =>
  knex.schema.createTable('drone', (t) => {
    t.increments().index();
    t.bigInteger('flytime');
    t.float('speed');
  });

const rollback = knex =>
  knex.schema.dropTable('drone');

exports.up = setup;
exports.down = rollback;
