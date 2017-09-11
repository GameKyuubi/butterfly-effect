// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable no-console */
/* eslint-disable */

const fetch = require('isomorphic-fetch');
const fs = require('fs');

class DroneController {
  constructor(source, destination, options, data) {
    this.stations = {};
    for(let station of data){
      this.stations[station.id] = {};
      this.stations[station.id].lat = station.lat;
      this.stations[station.id].lng = station.lng;
    }
    this.source = source;
    this.destination = destination;
    this.options = options;

    // Add Source and Destination Points to the List of Stations
    this.stations.source = this.source;
    this.stations.destination = this.destination;
    this.firstStation = this.findNearestStation(source);
  }

  findNearestStation(point) {
    let minDistance;
    let stationName;
    let stationLocation;
    let first = true;
    for (let station in this.stations) {
      let distance = this.distance(point, {
        lat: this.stations[station].lat,
        lng: this.stations[station].lng
      });
      if (station ==='source' || station === 'destination') {
        continue;
      }
      if (first){
        minDistance = distance;
        stationLocation = station;
        first = false;
      }
      if (distance < minDistance){
        minDistance = distance;
        stationName = station;
        stationLocation= this.stations[station];
      }
    }
    return {
      minDistance,
      stationName,
      stationLocation
    };
  }

  distance(a, b) {
    function deg2rad(deg) {
      return deg * (Math.PI/180);
    }
    const R = 6371;                // Radius of the earth in km
    const dLat = deg2rad(a.lat - b.lat);
    const dLng = deg2rad(a.lng - b.lng);
    let A =  Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(a.lat)) * Math.cos(deg2rad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    let C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
    let D = R * C;                 // Distance in km
    return D;
    
  }
  
  constructGraph() {
    this.graph = JSON.parse(fs.readFileSync(__dirname + '/graph2.json'));
    this.graph.source = {};
    this.graph.destination = {};

    for (let id in this.stations) {
      if (this.distance(this.stations[id], this.source) <= 2 ) {
        this.graph[id] = this.graph[id] || {};
        this.graph[id].source = this.distance(this.stations[id], this.source);
        this.graph.source[id] = this.distance(this.stations[id], this.source);
      }
      if (this.distance(this.stations[id], this.destination) <= 2 ) {
        this.graph[id] = this.graph[id] || {};
        this.graph[id].destination = this.distance(this.stations[id], this.destination);
        this.graph.destination[id] = this.distance(this.stations[id], this.destination);
      }
    }
  }
  
  calculatePath(parrents) {
    this.path = [];
    this.stationsOnPath = [];
    let current = 'destination';
    while (parrents[current] !== undefined) {
      this.path.push(this.stations[current]);
      this.stationsOnPath.push(current);
      current = parrents[current];
    }
    return {
      path: this.path.reverse(),
      stationsOnPath: this.stationsOnPath.reverse(),
    };
  }

  dijkstra() {
    if (this.firstStation.minDistance > this.options.MAX_DISTANCE / 2) {
      return this.minDistance = undefined;
    }
    let unvisited = Object.keys(this.graph);
    let dis = {};
    let current = 'source';
    let pathParrent = {};
    let maxStep = unvisited.length + 1;
    dis[current] = 0;
    while (maxStep--) {
      for (const adj in this.graph[current]) {
        if (dis[adj] === undefined ||
          dis[adj] > dis[current] + this.distance(this.stations[current], this.stations[adj])) {
          dis[adj] = dis[current] + this.distance(this.stations[current], this.stations[adj]);
          pathParrent[adj] = current;
        }
      }
      unvisited.splice(unvisited.indexOf(current), 1);
      if (current === 'destination') {
        console.log('reached destination');
        break;
      }
      current = null;
      for (const candidate of unvisited) {
        if (dis[candidate] !== undefined && (current === null || dis[current] > dis[candidate])) {
          current = candidate;
        }
      }
    }

    this.calculatePath(pathParrent);
    this.minDistance = dis.destination;
    return this.minDistance;
  }

  solve() {
    this.constructGraph();
    this.dijkstra();
    console.log('dijkstra ended');
    if(this.path === undefined && this.minDistance === undefined){
      return {
        distance: this.minDistance,
        path: []
      };
    }
    this.path.unshift(this.source);
    this.stationsOnPath.unshift('source');
    this.path.unshift(this.firstStation.stationLocation);
    this.stationsOnPath.unshift(this.firstStation.stationName);
    this.finalStation = this.findNearestStation(this.destination);
    if (this.finalStation.minDistance > this.options.MAX_DISTANCE / 2) {
      this.minDistance = undefined;
    } else {
      this.path.push(this.finalStation.stationLocation);
      this.stationsOnPath.push(this.finalStation.stationName);
    }
    if (this.minDistance === undefined) {
      this.path = [];
      this.stationsOnPath = [];
    }
    const route = [];
    for (let i = 0; i < this.path.length; i += 1) {
      route.push({
        name: this.stationsOnPath[i],
        lat: this.path[i].lat,
        lng: this.path[i].lng,
      });
    }
    return {
      distance: this.minDistance,
      path: route
    };
  }
}
/* eslint-enable */
module.exports = DroneController;
