[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19770196&assignment_repo_type=AssignmentRepo)
# Express.js RESTful API Assignment

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling.

## Assignment Overview

You will:
1. Set up an Express.js server
2. Create RESTful API routes for a product resource
3. Implement custom middleware for logging, authentication, and validation
4. Add comprehensive error handling
5. Develop advanced features like filtering, pagination, and search

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install dependencies:
   ```
   npm install
   ```
4. Run the server:
   ```
   npm start
   ```

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Starter Express.js server file
- `.env.example`: Example environment variables file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## API Endpoints

The API will have the following endpoints:

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all the required API endpoints
2. Implement the middleware and error handling
3. Document your API in the README.md
4. Include examples of requests and responses

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 


# HOW TO NAVIGATE MY PROJECT

Product Management API
This is a RESTful API for managing products, built with Node.js, Express, and MongoDB (via Mongoose). It includes features like CRUD operations, filtering, pagination, search, and product statistics, along with robust error handling.

How to Run Your Server
Follow these steps to get the API server up and running on your local machine.

Prerequisites
Node.js (LTS version recommended)

MongoDB Atlas account (or a local MongoDB instance)

Setup Steps
Clone the Repository (if applicable):
If this code is part of a larger repository, clone it first.

Install Dependencies:
Navigate to the project root directory in your terminal and install the required Node.js packages:

pnpm install express mongoose

Configure Environment Variables:
The application uses environment variables for sensitive information like your MongoDB connection string and for setting the environment mode.

Create a file named .env in the root directory of your project.

Copy the contents from the provided .env.example file into your new .env file.

Replace the placeholder YOUR_MONGODB_CONNECTION_STRING with your actual MongoDB Atlas connection string. This string typically looks like mongodb+srv://<username>:<password>@cluster0.akx03ss.mongodb.net/productsDB?retryWrites=true&w=majority.

Set NODE_ENV to development for detailed error messages during development, or production for more generic error messages in a production environment.

Your .env file should look something like this:

# .env
MONGO_URI="mongodb+srv://Prevyne:Justcause2@cluster0.akx03ss.mongodb.net/productsDB?retryWrites=true&w=majority"
NODE_ENV=development

Start the Server:
Once the dependencies are installed and the .env file is configured, start the server:

npm .js

OR

pnpm run launch

You should see output similar to this in your console:

Connected to MongoDB successfully!
Server running on http://localhost:3000
API Endpoints:
  GET /products?category=[categoryName]&page=[number]&limit=[number]
  GET /products/:id
  POST /products
  PUT /products/:id
  DELETE /products/:id
  GET /products/search?name=[productName]
  GET /products/stats

The server will now be running on http://localhost:3000.

API Endpoints Documentation
Base URL
http://localhost:3000

Products
1. Get All Products
URL: /products

Method: GET

Description: Retrieves a list of all products. Supports filtering by category and pagination.

Query Parameters:

category (optional): Filter products by a specific category name (e.g., Electronics, Books).

page (optional): The page number for pagination (default: 1).

limit (optional): The number of products per page (default: 10).

Success Response (200 OK):

{
    "status": "success",
    "results": 2,
    "pagination": {
        "currentPage": 1,
        "limit": 10,
        "totalPages": 1,
        "totalProducts": 2
    },
    "data": {
        "products": [
            {
                "_id": "65b9a7c3b2d1e0f9a8b7c6d5",
                "id": 1,
                "name": "Laptop",
                "description": "High performance laptop for gaming and work.",
                "price": 1200,
                "category": "Electronics",
                "inStock": true,
                "createdAt": "2024-01-31T10:00:00.000Z",
                "updatedAt": "2024-01-31T10:00:00.000Z",
                "__v": 0
            },
            {
                "_id": "65b9a7c3b2d1e0f9a8b7c6d6",
                "id": 2,
                "name": "Smartphone",
                "description": "Latest model smartphone.",
                "price": 800,
                "category": "Electronics",
                "inStock": true,
                "createdAt": "2024-01-31T10:05:00.000Z",
                "updatedAt": "2024-01-31T10:05:00.000Z",
                "__v": 0
            }
        ]
    }
}

Error Response (500 Internal Server Error):

{
    "status": "error",
    "message": "Failed to retrieve products"
}

2. Get a Specific Product by ID
URL: /products/:id

Method: GET

Description: Retrieves a single product by its unique numerical id.

URL Parameters:

id (required): The numerical ID of the product.

Success Response (200 OK):

{
    "status": "success",
    "data": {
        "product": {
            "_id": "65b9a7c3b2d1e0f9a8b7c6d5",
            "id": 1,
            "name": "Laptop",
            "description": "High performance laptop for gaming and work.",
            "price": 1200,
            "category": "Electronics",
            "inStock": true,
            "createdAt": "2024-01-31T10:00:00.000Z",
            "updatedAt": "2024-01-31T10:00:00.000Z",
            "__v": 0
        }
    }
}

Error Response (400 Bad Request - Invalid ID):

{
    "status": "fail",
    "message": "Invalid product ID format. Must be a number."
}

Error Response (404 Not Found):

{
    "status": "fail",
    "message": "Product with ID 999 not found."
}

3. Create a New Product
URL: /products

Method: POST

Description: Creates a new product. The id will be automatically generated.

Request Body (JSON):

{
    "name": "New Gaming Mouse",
    "description": "Ergonomic RGB gaming mouse with high DPI.",
    "price": 75.99,
    "category": "Electronics",
    "inStock": true
}

Success Response (201 Created):

{
    "status": "success",
    "data": {
        "product": {
            "name": "New Gaming Mouse",
            "description": "Ergonomic RGB gaming mouse with high DPI.",
            "price": 75.99,
            "category": "Electronics",
            "inStock": true,
            "_id": "65b9a8f4c2e1f0g9b8c7d6e4",
            "createdAt": "2024-01-31T10:15:00.000Z",
            "updatedAt": "2024-01-31T10:15:00.000Z",
            "id": 3,
            "__v": 0
        }
    }
}

Error Response (400 Bad Request - Validation Error):

{
    "status": "fail",
    "message": "Invalid input data. Product name is required. Product price is required. Product category is required.",
    "errors": [
        "Product name is required.",
        "Product price is required.",
        "Product category is required."
    ]
}

Error Response (400 Bad Request - Duplicate ID - less likely with auto-generation, but possible with race condition):

{
    "status": "fail",
    "message": "Duplicate field value: "3". Please use another value!",
}

4. Update an Existing Product
URL: /products/:id

Method: PUT

Description: Updates an existing product identified by its numerical id.

URL Parameters:

id (required): The numerical ID of the product to update.

Request Body (JSON - partial or full update):

{
    "price": 1150.00,
    "inStock": false
}

Success Response (200 OK):

{
    "status": "success",
    "data": {
        "product": {
            "_id": "65b9a7c3b2d1e0f9a8b7c6d5",
            "id": 1,
            "name": "Laptop",
            "description": "High performance laptop for gaming and work.",
            "price": 1150,
            "category": "Electronics",
            "inStock": false,
            "createdAt": "2024-01-31T10:00:00.000Z",
            "updatedAt": "2024-01-31T10:20:00.000Z",
            "__v": 0
        }
    }
}

Error Response (404 Not Found):

{
    "status": "fail",
    "message": "Product with ID 999 not found."
}

Error Response (400 Bad Request - Validation Error):

{
    "status": "fail",
    "message": "Invalid input data. Price cannot be negative.",
    "errors": ["Price cannot be negative."]
}

5. Delete a Product
URL: /products/:id

Method: DELETE

Description: Deletes a product identified by its numerical id.

URL Parameters:

id (required): The numerical ID of the product to delete.

Success Response (204 No Content):
(No response body is returned for 204 status)

Error Response (404 Not Found):

{
    "status": "fail",
    "message": "Product with ID 999 not found."
}

Search
1. Search Products by Name
URL: /products/search

Method: GET

Description: Searches for products whose names contain the specified string (case-insensitive).

Query Parameters:

name (required): The string to search for within product names (e.g., phone, lap).

Success Response (200 OK):

{
    "status": "success",
    "results": 1,
    "data": {
        "products": [
            {
                "_id": "65b9a7c3b2d1e0f9a8b7c6d6",
                "id": 2,
                "name": "Smartphone",
                "description": "Latest model smartphone.",
                "price": 800,
                "category": "Electronics",
                "inStock": true,
                "createdAt": "2024-01-31T10:05:00.000Z",
                "updatedAt": "2024-01-31T10:05:00.000Z",
                "__v": 0
            }
        ]
    }
}

Error Response (400 Bad Request - Missing Name):

{
    "status": "fail",
    "message": "Please provide a 'name' query parameter for search."
}

Error Response (404 Not Found - No Matches):

{
    "status": "fail",
    "message": "No products found matching \"xyz\"."
}

Statistics
1. Get Product Statistics
URL: /products/stats

Method: GET

Description: Provides aggregated statistics about products, grouped by category (e.g., count, total price, average price, min/max price per category).

Success Response (200 OK):

{
    "status": "success",
    "data": {
        "stats": [
            {
                "categoryName": "Electronics",
                "count": 2,
                "totalPrice": 2000,
                "averagePrice": 1000,
                "minPrice": 800,
                "maxPrice": 1200
            },
            {
                "categoryName": "Books",
                "count": 1,
                "totalPrice": 25,
                "averagePrice": 25,
                "minPrice": 25,
                "maxPrice": 25
            }
        ]
    }
}

Error Response (404 Not Found - No Stats Available):

{
    "status": "fail",
    "message": "No product statistics available."
}

Error Handling
This API implements a global error handling middleware to provide consistent and informative error responses.

Operational Errors (4xx status codes): For errors like "Not Found" or "Bad Request" due to client input, the API returns a fail status with a descriptive message.

Programming Errors (5xx status codes): For unexpected server-side errors, a generic error status with a message "Something went very wrong!" is returned in production to prevent leaking sensitive information. In development, detailed error messages and stack traces are provided.

Validation Errors: Mongoose validation errors are caught, and a 400 Bad Request is returned with specific messages about what fields failed validation.

Duplicate Key Errors: If you attempt to create a resource with a unique field value that already exists, a 400 Bad Request with a "Duplicate field value" message is returned.