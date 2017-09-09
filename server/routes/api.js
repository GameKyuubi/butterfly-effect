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
      res.status(400).send('Bad Request');
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
      const routes = req.body.routes;
      const trip = {
        tracknum: uuidv4(),
        status: 'inprogress',
      };

      // store trip
      const tripResult = await services.db.trip.create(trip);
      const tripid = tripResult.id;

      for (let i = 0, len = routes.length; i < len; i += 1) {
        if (i !== len - 1) {
          const segment = {
            source_id: routes[i].id,
            des_id: routes[i + 1].id,
            trip_id: tripid,
            drone_id: i + 1,
          };
          if (i === 0) {
            segment.status = 'inprogress';
          } else {
            segment.status = 'waiting';
          }
          // store segments
          await services.db.segment.create(segment);
        }

        if (routes[i].name === 'source' || routes[i].name === 'destination') {
          const route = {
            type: routes[i].name,
            latitude: routes[i].lat,
            longitude: routes[i].lng,
          };
          // store places
          await services.db.place.create(route);
        }
      }
      const ret = {
        stat: 'Successful!',
        tracknum: trip.tracknum,
      };
      res.status(200).send(ret);
    } catch (err) {
      res.status(400).send('Bad Request');
    }
  });

  router.post('/tracknum', async (req, res) => {
    try {
      let tracknum = req.body.id;
      const trip = await services.db.trip.search(tracknum);
      const tripid = trip.id;
      const segments = await services.db.segment.search(tripid);

      for (let i = 0; i < segments.length; i++) {
        if (segments[i].status === 'inprogress') {
          const drone_id = segments[i].drone_id;
          console.log(segments[i], 'segments[i]');
          console.log('segments[i].drone_id', segments[i].drone_id);
          //   const telemetryone = await services.db.telemetry.search(drone_id);
          //   console.log("telemetry", telemetryone)
        }
      }

      res.status(200).send('sending');
    } catch (err) {
      throw err;
    }
  });

  return router;
};
