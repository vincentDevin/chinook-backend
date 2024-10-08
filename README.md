
# Chinook Backend

This project is a backend service built with Node.js and Express. It uses MySQL as its database, and Docker is used for containerization.

## Prerequisites

Before setting up the project, make sure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for running locally without Docker, if needed)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (for managing dependencies)

## Project Setup

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/vincentDevin/chinook-backend.git
cd chinook-backend
```

### 2. Set Up Environment Variables

Create a `.env` file at the root of the project with the following environment variables:

```bash
# .env

# MySQL Configuration
DB_ROOT_PASSWORD=myRootPassword     # Set a secure root password for MySQL
DB_USER=myuser                      # Non-root user for MySQL
DB_PASSWORD=myUserPassword          # Password for the non-root user
DB_NAME=chinook                     # Name of the database to be created
DB_HOST=db                          # Hostname for MySQL container, should match the service name in docker-compose
DB_PORT=3306                        # MySQL default port

# Application Configuration
APP_PORT=3000                       # Port your Node.js app will run on

# Security
ACCESS_TOKEN_SECRET=mySecretKey     # Secret key for signing JWT tokens (change to a strong, random value)
```

These environment variables will be used by both Docker and your Node.js application.

### 3. Initialize the Database

Ensure you have an `init.sql` file in the project root. This file will be used to initialize the MySQL database when the container is first started. It should contain the SQL commands to set up the necessary tables and seed data.

For example:

```sql
CREATE DATABASE IF NOT EXISTS chinook_db;
USE chinook_db;

-- Create your tables here
```

### 4. Run the Application

You can run the application locally using Docker. The `docker-compose.yml` file is already configured to set up a MySQL database and a Node.js server.

> **Note:** All Docker commands should be run from a root terminal.

To start the application, run the following:

```bash
docker-compose up --build
```

This command will:

- Build the Docker image for the backend service (`app`).
- Set up the MySQL container (`db`).
- Start both services and network them together.

### 5. Access the Application

Once Docker Compose has finished setting up the services, the backend should be running on `http://localhost:3000` (or the port you defined in your `.env` file as `APP_PORT`).

You can access the MySQL database on `localhost:3306` using the credentials you defined in the `.env` file.

### 6. Stopping the Services

To stop the services, use:

```bash
docker-compose down
```

This will stop and remove the containers while keeping the data in the named volumes.

If you need to reset the database and reinitialize it from the `init.sql` file, use:

```bash
docker-compose down -v
```

This will remove the containers and volumes, allowing you to start fresh.

## Running Locally without Docker

If you'd like to run the application locally without Docker, follow these steps:

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Compile TypeScript to JavaScript:

   ```bash
   npm run build
   ```

3. Start the application:

   ```bash
   npm run start
   ```

Ensure that MySQL is installed and running on your local machine, and that the database configuration in your `.env` file matches your local setup.

## Development Mode

For development, use the following command to start the server with automatic reloading using Nodemon:

```bash
npm run dev
```

This will watch your TypeScript files and automatically restart the server when changes are detected.

## Contributing

If you'd like to contribute, feel free to submit a pull request or open an issue.
