// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

const express = require('express');

const router = express.Router();
const uuidv4 = require('uuid/v4');
const Dijkstra = require('../utils/droneController');
const helper = require('../utils/dbHelper');

const { getStations, storeTrip, storeSegments, storePlaces, getTrip, getSegments, getTelemetry } = helper;

router.get('/stations', async (req, res) => {
  try {
    const stations = await getStations();
    console.log(`Stations near Tokyo: ${stations.length}`);
    res.status(200).json(stations);
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Bad Request' });
  }
});

router.post('/calculate', async (req, res) => {
  try {
    const stations = await getStations();
    console.log(`Stations near Tokyo: ${stations.length}`);
    const dijkstra = new Dijkstra(req.body.from, req.body.dest, { MAX_DISTANCE: 4 }, stations);
    const result = dijkstra.solve();
    console.log('result', result);
    res.json(result);
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Bad Request' });
  }
});

router.post('/routes', async (req, res) => {
  try {
    const routes = req.body.route;
    const trip = {
      tracknum: uuidv4(),
      status: 'inprogress',
    };
    const tripid = await storeTrip(trip);

    for (let i = 0, length = routes.length; i < length; i += 1) {
      if (i !== length - 1) {
        const segment = {
          source_id: routes[i].id,
          des_id: routes[i + 1].id,
          trip_id: tripid,
          drone_id: i + 1,
        };
        segment.status = i === 0 ? 'inprogress' : 'waiting';
        await storeSegments(segment);
      }

      if (routes[i].name === 'source' || routes[i].name === 'destination') {
        const route = {
          type: routes[i].name,
          latitude: routes[i].lat,
          longitude: routes[i].lng,
        };
        await storePlaces(route);
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

router.post('/tracknum', async (req, res) => {
  try {
    const tracknum = req.body.id;
    const trip = await getTrip(tracknum);
    const segments = await getSegments(trip.id);

    let telemetry = {};
    for (let i = 0, length = segments.length; i < length; i += 1) {
      if (segments[i].status === 'inprogress') {
        const droneId = segments[i].drone_id;
        telemetry = await getTelemetry(droneId);
      }
    }
    const ret = {
      routes: segments,
      telemetry: telemetry[0],
    };
    console.log('ret', ret);
    res.status(200).json(ret);
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Bad Request' });
  }
});

module.exports = router;
