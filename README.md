## DevDeskQueue Team #2 Backend 
	Backend URL: To be announced.

## Schemas
	Users: {
		id, username, password
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
	Request Body:
	{
		"username": *Required*
		"password": *Required*
	}
	Response Status: 200
	Response Body:
	{
		message: `Welcome back, ${username}!`,
		user: * Logged-in User Object *
		token: * Generated JWT Token, for further requests. *
	}
	--------------------------
	-> POST "/auth/register"
	Request Body
	{
		"username": *Required*
		"password": *Required*
		"role_id": *Required*
	}
	Response Status: 201
	Response Body:
	{
		message: `${username} created successfully.`,
		user: * Logged-in User Object *
		token: * Generated JWT Token, for further requests. *
	}
	Notes:
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
	-> PUT '/api/users/${id}'
		- Request body must contain one or more of the following to update:
			- Username -> 'username'
			- Password -> 'password'
			- RoleID -> 'role_id'
		- Returns a single user object of the updated user information.
		- Status: 200.
	-> DELETE '/api/users/${id}'
		- Deletes a single user by ID.
		- Response body will return: 'User #${id} was deleted.'