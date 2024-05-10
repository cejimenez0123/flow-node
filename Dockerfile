
# Use the official Node.js image as the base image
FROM node:21

# Set the working directory in the container


# Copy the application files into the working directory
COPY . /
EXPOSE 8080
# Install the application dependencies
RUN npm install

# Define the entry point for the container
CMD ["npm", "start"]