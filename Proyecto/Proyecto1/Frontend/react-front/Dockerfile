# Use the official Node.js image as a base image
FROM node:latest as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the production-ready application with a lightweight HTTP server
FROM nginx:alpine

# Copy the build output from the build stage to serve it with nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
