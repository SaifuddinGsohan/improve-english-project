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
