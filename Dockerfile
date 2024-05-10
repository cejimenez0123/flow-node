
# Use the official Node.js image as the base image
FROM node:21

# Set the working directory in the container
WORKDIR /

# Copy the application files into the working directory
COPY . /

# Install the application dependencies
RUN npm start

# Define the entry point for the container
CMD ["npm", "start"]