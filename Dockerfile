# Use an official Node.js runtime as a base image
FROM node:17

# Set the working directory inside the container
WORKDIR /

# Copy package.json and package-lock.json (if using npm) to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Specify the command to run your application (use 'npm start' if you have set it up in package.json)
CMD ["npm", "start"]
