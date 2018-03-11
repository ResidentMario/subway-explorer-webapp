# Use the Node LTS image
FROM node:carbon
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .

# Set up environment variables.
ARG GMAPS_PROXY_SERVICE_URI="localhost:9000"
ARG SUBWAY_EXPLORER_API_SERVICE_URI="localhost:3000"
RUN export GMAPS_PROXY_SERVICE_URI=${GMAPS_PROXY_SERVICE_URI}
RUN export SUBWAY_EXPLORER_SERVICE_URI=${SUBWAY_EXPLORER_SERVICE_URI}

# This image creates a working deployment by default that expects the API services to live at the paths given in the
# args. But it also packages a build script, build.sh, which may be rerun at any time to modify these paths and
# re-serve the application.
RUN ["chmod", "+x", "./scripts/build.sh"]
RUN ["npm", "run-script", "build"]

# Expose the app port
EXPOSE 8080
# Init the service
CMD [ "npx", "http-server", "." ]