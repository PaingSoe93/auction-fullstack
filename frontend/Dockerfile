# Step 1: Build the React application
FROM node:18.15.0-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the local files to the container
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve the React application
FROM nginx:1.19.0-alpine

# Copy the build directory from the previous step to nginx's serve folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
