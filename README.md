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

Then generate the distribution from the source by running the following:

```sh
npx browserify -t [ babelify --presets [ env react ] --plugins transform-object-rest-spread ] src/index.js -o dist/index.js
```

Finally, the application can be served by running the following from the root folder:

```sh
npx http-server .
```

The application will fail if you do not also have the `subway-explorer-gmaps-proxy` and `subway-explorer-api` services 
running as well. For instructions on setting those up, see the `README.md` in their respective repositories.

This application is still heavily a WIP. This quickstart is incomplete in the meantime!