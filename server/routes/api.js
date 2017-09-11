// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-mixed-operators */

const express = require('express');
const Dijkstra = require('../utils/droneController');
const uuidv4 = require('uuid/v4');

const router = express.Router();

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

module.exports = (services) => {
  const getStations = async () => {
    const stations = (await services.db.place.list()).map((station) => {
      return {
        id: station.id,
        lat: parseFloat(station.latitude),
        lng: parseFloat(station.longitude),
      };
    });
    console.log(`All stations: ${stations.length}`);
    const tokyo = { lat: 35.6895, lng: 139.6917 };
    return stations.filter(station =>
      distance(tokyo, station) < 15,
    );
  };

  /* GET stations */
  router.get('/stations', async (req, res) => {
    try {
      const stations = await getStations();
      console.log(`Stations near Tokyo: ${stations.length}`);
      res.status(200).json(stations);
    } catch (err) {
      res.status(400).send('Bad Request');
    }
  });

  /* POST calculate */
  router.post('/calculate', async (req, res) => {
    const stations = await getStations();
    console.log(`Stations near Tokyo: ${stations.length}`);
    const dijkstra = new Dijkstra(req.body.from, req.body.dest, { MAX_DISTANCE: 2 }, stations);
    const result = dijkstra.solve();
    console.log('result', result);
    res.json(result);
  });

  /* POST routes */
  router.post('/routes', async (req, res) => {
    try {
      const routes = req.body.route;
      console.log('Routes:', routes);
      const trip = {
        tracknum: uuidv4(),
        status: 'inprogress',
      };

      // store trip
      const tripResult = await services.db.trip.create(trip);
      const tripid = tripResult.id;
      console.log('Trip stored at id:', tripid);

      let sourceId = 0, des_id = 0;
      for (let i = 0, len = routes.length; i < len; i += 1) {
        if (routes[i].name === 'source' || routes[i].name === 'destination') {
          const route = {
            type: routes[i].name,
            latitude: routes[i].lat,
            longitude: routes[i].lng,
          };
          // store places
          if(routes[i].name === 'source') {
            sourceId = (await services.db.place.create(route)).id;
          } else {
            desId = (await services.db.place.create(route)).id;
          }
        }
      }

      for (let i = 0, len = routes.length; i < len; i += 1) {
        if (i !== len - 1) {
          let segment = {
            trip_id: tripid,
            drone_id: i + 1,
          };
          
          if (routes[i].name === 'source' || routes[i].name === 'destination') {
            segment.source_id = sourceId;
          } else {
            segment.source_id = parseInt(routes[i].name);
          }
          if (routes[i + 1].name === 'source' || routes[i + 1].name === 'destination') {
            segment.des_id = desId;
          } else {
            segment.des_id = parseInt(routes[i + 1].name);
          }

          if (i === 0) {
            segment.status = 'inprogress';
          } else {
            segment.status = 'waiting';
          }
          // store segments
          await services.db.segment.create(segment);
        }
      }

      const ret = {
        status: 'success',
        tracknum: trip.tracknum,
      };
      console.log(ret);
      res.status(200).json(ret);
    } catch (err) {
      res.status(400).json({ status: 'error', message: 'Bad Request' });
    }
  });

  router.post('/track', async (req, res) => {
    try {
      const tracknum = req.body.trackingNumber;
      console.log('Tracking number:', tracknum);
      const trip = await services.db.trip.search(tracknum);
      const tripid = trip.id;
      const segments = await services.db.segment.search(tripid);

      let telemetry = {};
      for (let i = 0; i < segments.length; i += 1) {
        if (segments[i].status === 'inprogress') {
          const droneId = segments[i].drone_id;
          telemetry = await services.db.telemetry.search(droneId);
        }
      }

      let route = [];
      for (let segment of segments) {
        let source = await services.db.place.search(segment.source_id);
        let dest = await services.db.place.search(segment.des_id);
        route.push({
          id: segment.id,
          sourceLat: source.latitude,
          sourceLng: source.longitude,
          destLat: dest.latitude,
          destLng: dest.longitude,
        });
      }

      const ret = {
        route,
        telemetry,
      };
      console.log(ret);
      res.status(200).json(ret);
    } catch (err) {
      res.status(400).json({ status: 'error', message: 'Bad Request' });
    }
  });

  return router;
};
