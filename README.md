# WTWR (What to Wear?): Back End
This is a back end part of the project WTWR. It's an API built to connect to a MongoDB database.
It has separate users (/users) and clothes (/items) databases.

Methodes used for users:
  GET /users — returns all users
  GET /users/:userId - returns a user by _id
  POST /users — creates a new user 

Methodes used for clothes:
  GET /items — returns all clothing items
  POST /items — creates a new item
  DELETE /items/:itemId — deletes an item by _id
  PUT /items/:itemId/likes — like an item
  DELETE /items/:itemId/likes — unlike an item 


## Project features

- JS
- Express
- MongoDB
- Routing
- Error handling

## Github repository
https://wtwrdc.surfnet.ca/
