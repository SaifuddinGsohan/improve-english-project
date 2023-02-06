# readvive_api

Readvive API is an express endpoint for readvive projects. This project is a web-based application built using Node.js, Express, and Prisma. Its purpose is to provide a platform for which users who want to improve their English reading effectively by providing a user-friendly interface, robust progress bar features, and integration with other productivity tools. Some of the key features include interesting content, categorization, reminders, and quiz. After using this application users can found them more confidence in English reading.

## Technology Stack
***

A list of technologies used within the project:
* [Node.js](https://nodejs.org/en/): Version 18.14.0 LTS 
* [Express](https://expressjs.com/): Version 4.18.2
* [Prisma](https://www.prisma.io/): Version 4.9.0
* [Postgres](https://www.postgresql.org/): Version 15

***

## Environment Variable
***

| Name | Description | Example |
|----------|----------|----------
| NODE_ENV | Env variable mode  | production or development |
| PORT | Running project in which port | 5000 |
| JWT_SECRET | JWT token scret | edvive |
| JWT_EXPIRES_IN | jwt token expired days | 90d |
| JWT_COOKIE_EXPIRES_IN  | jwt token cookie expired | 90 |
| PROJECT_ID  | GCP prject id for using gcp storage |  edvive-364913 |
| DATABASE_URL | Postgres db url | postgres://edvive:FvOB8A5OFkef1at4lf6Z0uLMVlwvnkVg@dpg-ceta2682i3mj6phhuh80-a.singapore-postgres.render.com/edvive_test_db |
| PRODUCTION_API_URL | Production server api url | https://readvive.onrender.com |
| LOCAL_HOST_API_URL  | Local server api url | http://localhost:5000 |
| AAMAR_PAY_SANDBOX_URL  | Payment getway sandbox url |  https://sandbox.aamarpay.com/jsonpost.php |
| AAMAR_PAY_SANDBOX_STORE_ID | Payment getway store id | aamarpaytest |
| AAMAR_PAY_SANDBOX_SIGNATURE_KEY  | Sandbox key |dbb74894e82415a2f7ff0ec3a97e4183 |
| AAMAR_PAY_PRODUCTION_URL  | Production url |  https://secure.aamarpay.com/jsonpost.php |
| AAMAR_PAY_PRODUCTION_STORE_ID | Production store id | edvive |
| AAMAR_PAY_PRODUCTION_SIGNATURE_KEY  | Production key |  5729e8911563793773321ac8d8ac85bb |


# Getting Started
***

## Prerequisites

* Node.js and npm (Node Package Manager) installed on your system.

## Installation

Clone this repository and navigate to the project directory:

```
git clone https://github.com/Edvive/readvive_api.git
cd readvive_api

```
Install the required packages using npm:
```
npm install
```

## Usage

Start the server by running the following command:

```
npm run start-dev

```
The server will be started at http://localhost:5000 by default. You can change the port number by setting the PORT environment variable.

## API Routes
The following API routes are available in this server:

### Auth

#### POST /api/v1/auth/signup
Create New account with this sign up process

##### Example Body Data

```json
{  
    "first_name":"Firoz",
    "last_name":"Suvrow",
    "email":"firozsuvrow@gmail.com",
    "password":"abcd1234",
    "confirm_password":"abcd1234",
    "phone":"01912345678"
}
```
If successfully user created then response will be:

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImZpcnN0X25hbWUiOiJGaXJveiIsImxhc3RfbmFtZSI6IlN1dnJvdyIsImxldmVsIjoiYmVnaW5uZXIiLCJpYXQiOjE2NzU2Nzc4NzEsImV4cCI6MTY4MzQ1Mzg3MX0.VX6TyxoMoqqVhe2JOhUFGUANz5M46lddWu7fK2D7MVw"
}
```

And token also set into the cookies for the further authentication process

Else if a user already created and trying to create again  then the server will give a status fail response like this:

```json
{
    "status": "fail",
    "message": "Duplicate fields value: email. Please use another value!"
}
```

#### POST /api/v1/auth/signin

Sign in route

##### Example Body Data

```json
{
    "email":"firozsuvrow@gmail.com",
    "password":"abcd1234"
}
```

##### Example Response

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImZpcnN0X25hbWUiOiJGaXJveiIsImxhc3RfbmFtZSI6IlN1dnJvdyIsImxldmVsIjoiYmVnaW5uZXIiLCJpYXQiOjE2NzU2Nzg0MjYsImV4cCI6MTY4MzQ1NDQyNn0.LdHO5UmSX-L9xKDpugCOQ5L5SIhaDU1_u9mOh-h9Nuk"
}
```
And token also set into the cookies for the further authentication process same as sign up 

If user provide wrong password then server response will be:

```json
{
    "status": "fail",
    "message": "Provided Wrong password"
}
```

#### PUT /api/v1/auth/update-password
update password

##### Example Body Data

```json
{
    "currentPassword":"abcd1234",
    "password":"iloveu143",
    "confirmPassword":"iloveu143"
}
```

##### Example Response

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImZpcnN0X25hbWUiOiJGaXJveiIsImxhc3RfbmFtZSI6IlN1dnJvdyIsImxldmVsIjoiYmVnaW5uZXIiLCJpYXQiOjE2NzU2Nzg4MjUsImV4cCI6MTY4MzQ1NDgyNX0.ohFi33brO72l6cKGQSCJCVKMlf_sbWsVC5rgZ5Wsm5w"
}
```

If Current password provided wrong then response will be:

```json
{
    "status": "fail",
    "message": "You current password is wrong."
}
```

#### GET /api/v1/auth/logout
Any kind of user can log out from server using this api route

No need any body data just hit this api and you will be logout from the application

##### Example Response
```json
{
    "status": "success"
}
```

### Admin Auth
Create an Admin user
#### POST /api/v1/auth/signup

##### Example Body Data

```json
{
    "first_name":"mohidul",
    "last_name":"alom",
    "email":"mohidulalom@gmail.com",
    "password":"1234abcd",
    "confirm_password":"1234abcd",
    "role":"admin",
    "phone":"01964941374"
}
```

You can also able to create a moderator, b2b user using this route by changing role as a moderator or b2b.
The main difference between user auth and admin auth is the defined role of an admin user
And Response will be the same as user authentication response

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RfbmFtZSI6Im1vaGlkdWwiLCJsYXN0X25hbWUiOiJhbG9tIiwibGV2ZWwiOiJiZWdpbm5lciIsImlhdCI6MTY3NTY3OTY5OSwiZXhwIjoxNjgzNDU1Njk5fQ.FzvJCya-bBcUh2r_x6xkRmhnF4CJ2WZbBdmScJVD99s"
}
```

### Landing
Only a valid admin user can be able to create landing page data

#### POST /api/v1/landing

##### landing body data will be form data:

| KEY | VALUE |
|----------|----------|
| images | Screenshot from 2023-01-04 14-37-45.png | 
| heading | readvive |
| sub_heading | Learning english with edvive it will great fun |
| cta | cta button text | 
| fa_cta | fa_cta button text | 
| fa_heading | fa_heading text | 



If user is not valid then server response will be:

```json
{
    "status": "fail",
    "message": "You do not have permission to perform this action"
}
```

If a landing page is created once then you can create a new one. You will only be able to update the previous landing page data:

```
statusCode : 409 Conflict
```

```json
{
    "status": "fail",
    "message": "Landing Page already created"
}
```

#### GET /api/v1/landing

fetch the landing page data

##### Example Response

```json
{
    "status": "success",
    "message": "Landing page information found",
    "data": {
        "id": 1,
        "heading": "readvive",
        "sub_heading": "this is readvive api",
        "cta": "this is readvive cta",
        "fa_heading": "this is fa heading",
        "fa_cta": "this is fa button cta",
        "landing_img1": "https://storage.googleapis.com/readvive/Screenshot_from_2023-01-04_14-37-45.png",
        "landing_img2": null,
        "landing_img3": null,
        "createdAt": "2023-02-01T12:42:44.993Z",
        "updatedAt": "2023-02-01T12:42:44.993Z"
    }
}

```

### Packages

#### POST /api/v1/packages

Create package only by valid admin or moderator

##### Example Body Data

```json
{
    "name":"testing",
    "title":"Testing Effectively with edvive",
    "currency": "BDT",
    "price":5000 ,
    "discount": 999,
    "expiration": 20
}
```
then response will be

```
statusCode : 200
```

```json
{
    "status": "success",
    "message": "Package Created Successfully"
}
```

#### GET /api/v1/packages
get all packages from database

##### Example Response

```json
{
    "status": "success",
    "message": "found all packages",
    "data": [
        {
            "id": 1,
            "name": "edvive english",
            "title": "Learn English Effectively with edvive",
            "currency": "BDT",
            "price": 2000,
            "discount": 10,
            "status": true,
            "expiration": 1,
            "createdAt": "2023-01-25T13:42:14.955Z",
            "updatedAt": "2023-01-25T13:42:14.955Z"
        },
        {
            "id": 2,
            "name": "testing",
            "title": "Testing Effectively with edvive",
            "currency": "BDT",
            "price": 5000,
            "discount": 999,
            "status": true,
            "expiration": 20,
            "createdAt": "2023-01-28T11:41:49.343Z",
            "updatedAt": "2023-01-28T11:41:49.343Z"
        },
        {
            "id": 3,
            "name": "testing",
            "title": "Testing Effectively with edvive",
            "currency": "BDT",
            "price": 5000,
            "discount": 999,
            "status": true,
            "expiration": 20,
            "createdAt": "2023-02-06T12:22:34.311Z",
            "updatedAt": "2023-02-06T12:22:34.311Z"
        }
    ]
}
```

#### GET /api/v1/packages/1

get a package by package id providing in url params

##### Example Response

```json
{
    "status": "success",
    "message": "Package found with that id:1",
    "data": {
        "id": 1,
        "name": "edvive english",
        "title": "Learn English Effectively with edvive",
        "currency": "BDT",
        "price": 2000,
        "discount": 10,
        "status": true,
        "expiration": 1,
        "createdAt": "2023-01-25T13:42:14.955Z",
        "updatedAt": "2023-01-25T13:42:14.955Z"
    }
}
```

#### PUT /api/v1/packages/1

Update a package by package id providing in url params

##### Example Body Data

```json
{
    "status":false
}
```
You can choose one field or multiple field

##### Example Response Data

```json
{
    "status": "success",
    "message": "Package Updated Successfully with that id :1"
}
```


