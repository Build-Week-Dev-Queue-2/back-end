
exports.up = function (knex) {
    /*
      - Users
      - Roles
      - UserRoles
      - Tickets
      - Categories
      - TicketCategories
      - Comments
    */
    return knex.schema
        .createTable('roles', tbl => {
            tbl.increments();
            tbl.text('role').notNullable();
        })
        .createTable('users', tbl => {
            tbl.increments();
            tbl.text('username').notNullable();
            tbl.text('password').notNullable();
            tbl.integer('role_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('roles');
        })
        .createTable('categories', tbl => {
            tbl.increments();
            tbl.text('name').notNullable();
        })
        .createTable('tickets', tbl => {
            tbl.increments();
            tbl.text('title').notNullable();
            tbl.text('content').notNullable();
            tbl.text('posted_time').notNullable();
            tbl.integer('author')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users');
            tbl.text('resolved').notNullable();
            tbl.text('resolved_time');
            tbl.integer('resolved_by')
                .unsigned()
                .references('id')
                .inTable('users');
            tbl.integer('category_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('categories');
        })
        .createTable('comments', tbl => {
            tbl.increments();

            tbl.integer('author')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users');
            tbl.text('message').notNullable();
            tbl.text('posted_time').notNullable();
            tbl.integer('ticket_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('tickets');
        })
};

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('comments')
    .dropTableIfExists('ticketcategories')
    .dropTableIfExists('categories')
    .dropTableIfExists('tickets')
    .dropTableIfExists('userroles')
    .dropTableIfExists('roles')
    .dropTableIfExists('users')
};
