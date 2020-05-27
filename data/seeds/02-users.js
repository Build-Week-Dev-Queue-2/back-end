const bc = require('bcryptjs')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(async function () {
      // Inserts seed entries
      const password = await bc.hashSync('pass', 10);
      return knex('users').insert([
        {username: "Pamela Halpert", password, role_id: 1},
        {username: "James Halpert", password, role_id: 1},
        {username: "Michael Scott", password, role_id: 2},
        {username: "admin", password, role_id: 2},
      ]);
    });
};
