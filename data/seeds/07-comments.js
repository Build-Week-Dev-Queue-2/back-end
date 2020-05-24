
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('comments').insert([
        {
          author: 3,
          message: "I grant your leave of absense.",
          posted_time: Date.now(),
          ticket_id: 1,
        },
        {
          author: 1,
          message: "Thank you, Michael!",
          posted_time: Date.now(),
          ticket_id: 1,
        },
        {
          author: 3,
          message: "I will have a career coach contact you.",
          posted_time: Date.now(),
          ticket_id: 2,
        },
        {
          author: 3,
          message: "Luis Ocasio should be contacting you.",
          posted_time: Date.now(),
          ticket_id: 2,
        }
      ]);
    });
};
