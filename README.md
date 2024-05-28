# IIT-B Assignment

## Overview
Welcome to my project developed for an assignment at **IIT Bombay**! This project is a web application that handles user authentication, profile management, and user registration. Let's dive into the details!

### Frontend
I built the frontend using **React**. I crafted various components like **login**, **main dashboard**, and **signup**, each serving its unique purpose in interacting with users.

#### Dependencies
To power the frontend, I relied on:
- **React**: A JavaScript library that brings the UI to life.
- **Axios**: A handy HTTP client for making requests.
- **React Router DOM**: Helps in navigating between different views.
- **React Google Recaptcha**: Ensures the registration process is bot-free.

### Backend
I built the backend with **Node.js** and **Express.js**, providing a robust API to communicate with the frontend. I've chosen **MongoDB** as the database to store all user-related information securely.

#### Dependencies
For the backend, I enlisted:
- **Express**: A speedy web framework for Node.js.
- **Bcrypt**: Keeps passwords hashed and secure.
- **Cors**: Essential for enabling Cross-Origin Resource Sharing.
- **Dotenv**: Handles loading environment variables from a .env file.
- **Joi**: Helps validate and describe schemas for data.
- **Jsonwebtoken**: Implements JSON Web Tokens for authentication.
- **Mongoose**: An elegant way to model MongoDB objects.
- **Multer**: Enables smooth handling of file uploads.
- **Nodemon**: Saves time by automatically restarting the server on file changes.

### How to Run Local
Getting the project up and running on your machine is a breeze:
1. **Clone this repository** to your local machine.
2. Navigate to the **frontend directory** and run `npm install` to install frontend dependencies.
3. Head over to the **backend directory** and run `npm install` to install backend dependencies and add these env to your backend.
```
MONGO_DB_URI = "Your_Mongo_URI"
JWTPRIVATEKEY = "my_secret_key" 
SALT = 10
PORT = 8000
```
4. Start the backend server by running `npm start` in the backend directory.
5. Fire up the frontend server by running `npm start` in the frontend directory.


### You can also check out the hosted version of the website [here](https://verdant-fudge-10942a.netlify.app/).

### Features
I'm proud of the features packed into this project:
- **User Authentication**: Secure login with JWT tokens.
- **User Registration**: Register with confidence, thanks to CAPTCHA verification.
- **Admin Dashboard**: A sleek interface for managing user accounts.
- **Profile Management**: Users can effortlessly update their profile information.

### Admin Details
For admin access, use the following credentials:
- **Username**: Shahid
- **Password**: Sidansari20@


Thank you for reading this :) :) :)
