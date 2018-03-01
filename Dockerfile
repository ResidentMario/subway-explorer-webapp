# This container definition based on https://nodejs.org/en/docs/guides/nodejs-docker-webapp/.

# Use the Node LTS image
FROM node:carbon
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
# Expose the app port
EXPOSE 8080
# Init the service
CMD [ "npx", "http-server", "." ]