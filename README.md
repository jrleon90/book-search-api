# Book Search API
## Table of Content

1. [Introduction](#introduction)
2. [Live example](#example)
3. [API Docs](#api_docs)

## Introduction <a name=introduction></a>
This is an API developed with NodeJS using Express, it uses MongoDB as the database and also Elasticsearch to perform the queries. For the routes security, it uses JWT.

## Live Example <a name=example></a>
There is a Live example for this API deployed in Heroku. In order to use it, you have to make all the requests to the following URI:
```
https://book-search-api.herokuapp.com
```

##API Docs <a name=api_docs></a>
The API route to any action related to the books, are protected with JWT, so in order to make this requests the user has to authenticate to get the respective token for the actions.

To get this token, send a GET request with Basic Auth to the URI:
```
GET https://book-search-api.herokuapp.com/login
```

![alt text](http://res.cloudinary.com/jrleon90/image/upload/v1528004591/login_comic_api.png "Postman example")

Once the request has been made with a valid login information, it returns a token that needs to be save in order to made every request.
  
1. **GET ALL BOOKS**

Send GET request to the following URI:
```
GET https://book-search-api.herokuapp.com/book
```

Since the routes are protected, the user needs to send the token in the header of the request with the key name "x-access-token" (see image)

![alt text](http://res.cloudinary.com/jrleon90/image/upload/v1528253006/get_book_request.png "Postman example")

The response it would a JSON object with the books inside the Elasticsearch index.

2. **SEARCH A BOOK**

Send a GET request to the following URI:
```
GET https://book-search-api.herokuapp.com/book/search?name=<complete or partial name>&tag=<complete or partial tag name>
```

The user can query multiple tags by adding more than one tag element to the query string:
```
GET https://book-search-api.herokuapp.com/book/search?tag=tag_1&tag=tag_2
```

Since the routes are protected, the user needs to send the token in the header of the request with the key name "x-access-token" (see image)

![alt text](http://res.cloudinary.com/jrleon90/image/upload/v1528253480/query_book.png "Postman example")

3. **ADD A BOOK**

Send a POST request with the token inside the header to the following URI:
```
POST https://book-search-api.herokuapp.com/book
```

Inside the body of the request, send a JSON object with the name and tags of the book (see image below)

![alt text](http://res.cloudinary.com/jrleon90/image/upload/v1528253853/create_book.png "Postman example")

4. **CREATE NEW USER**
  
Send POST request to:
  
```
POST https://book-search-api.herokuapp.com/user
```
  
With the request, send username and password inside the body in JSON format (see image)
  
 ![alt text](http://res.cloudinary.com/jrleon90/image/upload/v1528254131/create_user_book.png "Postman Example")






