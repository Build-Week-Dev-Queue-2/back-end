
## DevDeskQueue Team #2 Backend 
	Backend URL: https://devdeskqueue2backend.herokuapp.com/

## Schemas
	Users: {
		id: primary key
		username: string
		password: string
	},
	Tickets: {
		id: primary key
		title: string
		content: string
		posted_time: Date.now() Integer
		author: User ID
		resolved: boolean as string ('true'/'false')
		resolved_by: User ID
		resolved_time: Date.now() Integer
		category_id: Category ID
	},
	Comments: {
		id: primary key,
		message: string,
		author: User ID,
		ticket_id: Ticket ID,
		posted_time: Date.now() Integer
	}
## Endpoints
	Notes:
	- Authentication (JWT) token is required in axio's 'Authorization' header for all endpoints,
	  beside register and login.
	- All enpoint URLs come after the 'Backend URL' seen above.
---
#### Authentication Endpoints
	--------------------------
	**Authentication Endpoints**
	--------------------------
	-> POST "/auth/login"
		- Returns welcome message, logged-in user object, and authentication token.
		- Request Body
			- username - Required.
			- password - Required.
		- Response Status: 200
	--------------------------
	-> POST "/auth/register"
		- Returns success message, user object, and authentication token.
		- Request Body
			- username - Required.
			- password - Required
			- role_id - Required.
		- Response Status: 201
		- Notes:
			- Do not pass an ID - the database automatically generates the ID.
			- Roles:
				- 1: Student
				- 2: Helper
				- 3: Student & Helper
			- 'role_id' can be passed as string or integer, so don't worry about parsing.
---
#### User Endpoints
	--------------------------
	**User Endpoints**
	--------------------------
	-> GET '/api/users'
		- Returns an array of all users.
		- Status: 200.
	-> GET '/api/users/${id}'
		- Returns a single user object by ID.
		- Status: 200.
	-> GET '/api/users/${id}/tickets'
		- Returns an array of ticket by author (user id).
		- Status: 200.
	-> PUT '/api/users/${id}'
		- Request Body (one or more):
			- Username -> 'username'
			- Password -> 'password'
			- RoleID -> 'role_id'
		- Returns a single user object of the updated user information.
		- Status: 200.
	-> DELETE '/api/users/${id}'
		- Deletes a single user by ID.
		- Response body will return: 'User #${id} was deleted.'
---
#### Ticket Endpoints
	--------------------------
	**Ticket Endpoints**
	--------------------------
	-> GET '/api/tickets'
		- Returns an array of all tickets.
		- Status: 200.
	-> GET '/api/tickets/${id}'
		- Returns a single ticket object by ID.
		- Status: 200.
	-> GET '/api/tickets/${id}/comments'
		- Returns all comments for a given Ticket ID.
		- Status: 200.
	-> POST '/'
		- Returns the newly created ticket object.
		- Request Body
			- title - Required.
			- conent - Required.
			- author - Required.
			- category_id - Required.
		- Response Status: 201.
		- 'posted_time' is set by default.
		- 'resolved' is set by default.
		- 'resolved_by' and 'resolved_time' are null in database by default.
	-> PUT '/api/tickets/${id}'
		- Request body must contain one or more of the following to update:
			- Title -> 'title'
			- Content -> 'conent'
			- Author -> 'author' (user id)
			- Resolved -> 'resolved' ('true' or 'false')
			- Resolved Time -> 'resolved_time' (*must* be a valid Date.now() integer)
			- Resolved By -> 'resolved_by' (user id)
			- Category ID -> 'category_id'
		- Returns a single ticket object of the updated ticket information.
		- 'posted_time' can not be updated.
		- Status: 200.
---
#### Comment Endpoints
	--------------------------
	**Comment Endpoints**
	--------------------------
	-> GET '/api/comments'
		- Returns an array of all comments.
		- Status: 200.
	-> GET '/api/comments/${id}'
		- Returns a single comment object by ID.
		- Status: 200.
	-> POST '/'
		- Returns the newly created comment object.
		- Request Body
			- message - Required.
			- author - Required.
			- ticket_id - Required.
		- Response Status: 201.
		- 'posted_time' is set by default.
	-> PUT '/api/comments/${id}'
		- Request body must contain one or more of the following to update:
			- Message -> 'message'
			- Author -> 'author' (user id)
			- TicketID -> 'ticket_id'
		- Returns a single comment object of the updated comment information.
		- 'posted_time' can not be updated.
		- Status: 200.
