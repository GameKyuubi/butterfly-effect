// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const express = require('express');
const Dijkstra = require('../utils/droneController');
const uuidv4 = require('uuid/v4');

const router = express.Router();

module.exports = (services) => {
  /* GET stations */
  router.get('/stations', async (req, res) => {
    try {
      const stations = (await services.db.place.list()).map(station =>
        Object.assign({
          id: station.id,
          lat: parseFloat(station.latitude),
          lng: parseFloat(station.longitude),
        }),
      );
      console.log(stations);
      res.status(200).json(stations);
    } catch (err) {
      throw err;
    }
  });
  /* POST calculate */
  router.post('/calculate', (req, res) => {
    const dijkstra = new Dijkstra(req.body.from, req.body.dest, { MAX_DISTANCE: 4 });
    const result = dijkstra.solve();
    console.log(result);
    res.json(result);
  });
  /* POST routes */
  router.post('/routes', async (req, res) => {
    try {
      const routes = req.body;
      const tracknum = uuidv4();

      const trip = {};
      trip.tracknum = tracknum;
      trip.status = 'inprogress';
      // store trip
      const tripResult = await services.db.trip.create(trip);
      const tripid = tripResult.id;

      for (let i = 0, len = routes.length; i < len; i += 1) {
        if (i !== len - 1) {
          const segment = {};
          segment.source_id = routes[i].id;
          segment.des_id = routes[i + 1].id;
          segment.trip_id = tripid;
          segment.drone_id = null;
          // store segments
          await services.db.segment.create(segment);
        }

        if (routes[i].name === 'source' || routes[i].name === 'destination') {
          const route = {};
          route.type = routes[i].name;
          route.latitude = routes[i].lat;
          route.longitude = routes[i].lng;
          // store places
          await services.db.place.create(route);
        }
      }

      res.status(200).send('Successful!');
    } catch (err) {
      throw err;
    }
  });


  return router;
};
