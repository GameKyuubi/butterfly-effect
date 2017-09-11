const helper = require('../server/utils/dbHelper');
const { getStations } = helper;
const AirspaceChecker = require('../server/lib/AirspaceChecker');
const fs = require('fs');

const distance = (a, b) => {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(a.lat - b.lat);
  const dLng = deg2rad(a.lng - b.lng);
  const A = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(a.lat)) * Math.cos(deg2rad(b.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * C; // Distance in km
};

(async () => {
  const data = await getStations();

  let stations = {};
  for(let station of data){
    stations[station.id] = {};
    stations[station.id].lat = station.lat;
    stations[station.id].lng = station.lng;
  }

  let graph = {};
  let c = 0;
  let done = 0;
  for (let point in stations) {
    for (let adj in stations) {
      if (point === adj) {
        continue;
      }
      if (distance(stations[point], stations[adj]) <= 2 ) {
        let origin = [stations[point].lat, stations[point].lng];
        let destination = [stations[adj].lat, stations[adj].lng];
        console.log('Checking segment:', origin, destination);
        setTimeout(function() {
          AirspaceChecker.checkSpace(origin, destination)
            .then(valid => {
              if(valid) {
                graph[point] = graph[point] || {};
                graph[point][adj] = distance(stations[point], stations[adj]);
                valid ? {} : console.log(done, 'is not valid');
                done++;
                if(done >= 19260 || done % 1000 === 0) {
                  fs.writeFile('../server/utils/graph.json', JSON.stringify(graph), () => {});
                }
              }
            })
        }, 10 * c++);
      }
    }
  }
})();
