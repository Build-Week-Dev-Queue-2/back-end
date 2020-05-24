
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tickets').del()
    .then(function () {
      // Inserts seed entries
      return knex('tickets').insert([
        {
          author: 1,
          title: "I need a leave of absense.",
          content: "I am writing a great reason in this section for why I need a leave of absense. Please grant it to me.",
          resolved: 'false',
          category_id: 2,
          posted_time: Date.now(),
        },
        {
          author: 2,
          title: "Career Coaching.",
          content: "I've been looking for job everywhere, but can not find one. Please help me!",
          resolved: 'true',
          category_id: 3,
          posted_time: Date.now(),
        },
        {
          author: 3,
          title: "My computer keeps talking to me.",
          content: "Every time I click a key, the laptop talks to me. Reads the page and the key I typed, driving me nuts!",
          resolved: 'false',
          category_id: 1,
          posted_time: Date.now(),
        }
      ]);
    });
};
