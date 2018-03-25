## About 

The [Metropolitan Transit Authority](https://en.wikipedia.org/wiki/Metropolitan_Transportation_Authority) is the 
primary public transportation authority for the greater New York City region. It provides real-time information about 
its buses, subway trains, and track trains using a bundle of what are called [GTFS-Realtime 
feeds](https://developers.google.com/transit/gtfs-realtime/). Each GTFS-RT feed represents a snapshot of a slice of the 
MTA's service jurisdiction at a certain timestamp.

This repository comprises a web application which uses MTA GTFS-Realtime data to surface relevant train trip information 
to users. It is dependent on the APIs defined in the  and  repositories.

This application is a proof-of-concept meant to demonstrate the utility of the ground-truth train arrival and departure 
data provided by the [`subway-explorer-api`](https://github.com/ResidentMario/subway-explorer-api). It is also 
dependent on [`subway-explorer-gmaps-proxy`](https://github.com/ResidentMario/subway-explorer-gmaps-proxy).

## Quickstart

You will need to have [Node.JS](https://nodejs.org/en/) installed and configured.

Clone this repository:

```sh
git clone https://github.com/ResidentMario/subway-explorer-webapp
```

Enter the root of your copy of the repository and install the required packages:

```sh
npm install --all
```

Set environment variables pointing to the `subway-explorer-api` and `subway-explorer-gmaps-proxy` services:

    export GMAPS_PROXY_SERVICE_URI=localhost:9000
    export SUBWAY_EXPLORER_SERVICE_URI=localhost:3000

Then generate the distribution from the source by running the following:

```sh
npm run-script build
```

Finally, the application can be served by running the following from the root folder:

```sh
npx http-server .
```

The application will fail if you do not also have the `subway-explorer-gmaps-proxy` and `subway-explorer-api` services 
running as well. For instructions on setting those up, see the `README.md` in their respective repositories.

This application is still heavily a WIP. This quickstart is incomplete in the meantime!

## Using the container

This repo contains a Docker file bundled with Node.JS and this application.

To build the container image, run the following from the root folder:

    docker build -t residentmario/subway-explorer-webapp .

The container build process will, by default, assume that the two API services are exposed on localhost at ports 9000 and 3000, respectively. This is the default configuration, and what you will get if you follow the instructions in the `README` files verbatim. If you're running the services someplace else, you can change where the application looks for them by running the following instead:

    docker build . -t residentmario/subway-explorer-webapp:latest --build-arg GMAPS_PROXY_SERVICE_URI=URI:PORT SUBWAY_EXPLORER_SERVICE_URI=URI:PORT

Replacing `URI:PORT` with the locations and ports of your choosing.

Then, to run the container (pointing it to `localhost:8080`):

    docker run -p 8080:8080 -d residentmario/subway-explorer-webapp

You can visit the following URI in the browser to verify that the connection is being served:

```
http://localhost:8080
```

You can also jump inside the container by running `docker exec -it 949cc5d81abe /bin/bash` (replacing the name with the 
name of the running image, discoverable via `docker ps`) and inspect the running processes to verify things are running 
as expected.

## Project status

The Kubernetes deployment files and instructions works. `subway-explorer-gmaps-proxy` performs as expected. `subway-explorer-gmaps-webapp` allows you to make transit choices and performs the XHR, but doesn't use that to display any information (e.g. the front-end information display element is completely not started).

The problem is that `compile-gtfs-feed-to-db.py` in the `subway-explorer-api` repository assumes that every line gets its own stop entity at a station (e.g. there are two Avenue U stops, one for the B train and one for the Q train). However, the GTFS feed is actually inconsistent about this.

Instead this code needs to be rewritten to build Monte Carlo graphs,measure transition probabilities, and do pruning to determine what trains stop where.