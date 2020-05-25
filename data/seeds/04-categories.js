
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('categories').insert([
        { name: "Technical Support" },
        { name: "Leave of Absense" },
        { name: "Student Support" },
      ]);
    });
};
