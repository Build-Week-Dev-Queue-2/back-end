const bc = require('bcryptjs')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(async function () {
      // Inserts seed entries
      const password = await bc.hashSync('pass', 10);
      return knex('users').insert([
        {id: 1, username: "admin", password, role_id: 2},
        {id: 2, username: "Dwight", password, role_id: 1},
        {id: 3, username: "Frodo", password, role_id: 1},
      ]);
    });
};
