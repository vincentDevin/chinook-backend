
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

First, clone the project repository to your local machine.

```bash
git clone https://github.com/your-repo/chinook-backend.git
cd chinook-backend
```

### 2. Environment Variables

Create a `.env` file at the root of the project with the following environment variables:

```bash
# MySQL settings
DB_ROOT_PASSWORD=your-root-password
DB_NAME=chinook_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_PORT=3306

# Application settings
APP_PORT=3000
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

To start the application, simply run:

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

Make sure MySQL is installed and running on your local machine, and that the database configuration in your `.env` file matches your local setup.

## Development Mode

For development, use the following command to start the server with automatic reloading using Nodemon:

```bash
npm run dev
```

This will watch your TypeScript files and automatically restart the server when changes are detected.

## Contributing

If you'd like to contribute, feel free to submit a pull request or open an issue.
