// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable no-console */
/* eslint-disable */

const fetch = require('isomorphic-fetch');
const AirspaceChecker = require('../lib/AirspaceChecker');
// const fs = require('fs');

class Graph{
  constructor(options, data) {
    this.stations = {};
    for (let station of data) {
      this.stations[station.id] = {};
      this.stations[station.id].lat = station.lat;
      this.stations[station.id].lng = station.lng;
    }
    this.options = options;
    this.constructGraph();
    return this.graph;

  }

  distance(a, b) {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371;                // Radius of the earth in km
    const dLat = deg2rad(a.lat - b.lat);
    const dLng = deg2rad(a.lng - b.lng);
    let A = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(a.lat)) * Math.cos(deg2rad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    let C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
    let D = R * C;                 // Distance in km
    return D;

  }

  constructGraph() {
    let c = 0;
    this.graph = {};
    let promises = [];
    for (let point in this.stations) {
      if (!this.stations[point] || !this.stations[point].lat || !this.stations[point].lng) continue;

      for (let adj in this.stations) {
        if (!this.stations[adj] || !this.stations[adj].lat || !this.stations[adj].lng) continue;
        if (point === adj) {
          continue;
        }
        if (this.distance(this.stations[point], this.stations[adj]) <= this.options.MAX_DISTANCE){
          promises.push( new Promise((resolve,reject) => {
            setTimeout(() => {
              let notBanned = (AirspaceChecker.checkSpace
                ([this.stations[point].lat, this.stations[point].lng], [this.stations[adj].lat, this.stations[adj].lng]));
              if (notBanned) {
                this.graph[point] = this.graph[point] || {};
                this.graph[point][adj] = this.distance(this.stations[point], this.stations[adj]);
              }
              resolve();
            }, 10 * c++ );
          }).catch(err => {
            console.log(err);
          }));
        }
      }
    }
    return Promise.all(promises).then(() => {
      console.log('promises finished')
    });
  }

  

}
/* eslint-enable */
module.exports = Graph;
