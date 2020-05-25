
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: "Pamela Halpert", password: "The Office", role_id: 1},
        {username: "James Halpert", password: "The Office", role_id: 1},
        {username: "Michael Scott", password: "The Office", role_id: 2},
      ]);
    });
};
