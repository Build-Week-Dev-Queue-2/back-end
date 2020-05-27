const bc = require('bcryptjs')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: "Pamela Halpert", password: bc.hash("The Office", 10), role_id: 1},
        {username: "James Halpert", password: bc.hash("The Office", 10), role_id: 1},
        {username: "Michael Scott", password: bc.hash("The Office", 10), role_id: 2},
        {username: "admin", password: bc.hash("pass", 10), role_id: 2},
      ]);
    });
};
