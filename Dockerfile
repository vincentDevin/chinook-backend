# Dockerfile

# Use the latest Node.js LTS version as a parent image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install all dependencies, including devDependencies for building
RUN npm install

# Copy the rest of the source code into the container
COPY . .

# Build the TypeScript code (if using TypeScript)
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the application using compiled JavaScript
CMD ["npm", "start"]
