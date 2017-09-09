// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-mixed-operators */

const express = require('express');

const router = express.Router();
const Dijkstra = require('../utils/droneController');
const uuidv4 = require('uuid/v4');
const db = require('../knexfile.js');


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

const getStations = async () => {
  const stations = (await db('place').where({ type: 'station' }).select())
    .map((station) => {
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
  const dijkstra = new Dijkstra(req.body.from, req.body.dest, { MAX_DISTANCE: 4 }, stations);
  const result = dijkstra.solve();
  console.log('result', result);
  res.json(result);
});

/* POST routes */
router.post('/routes', async (req, res) => {
  try {
    const routes = req.body.route;
    const trip = {
      tracknum: uuidv4(),
      status: 'inprogress',
    };

    // store trip
    const tripResult = await db('trip')
      .returning('id')
      .insert({
        tracknum: trip.tracknum,
        status: trip.status,
      });
    console.log('tripResult:', tripResult[0]);
    const tripid = tripResult[0];

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
        const segmentId = await db('segment')
          .returning('id')
          .insert({
            source_id: segment.source_id,
            des_id: segment.des_id,
            trip_id: segment.trip_id,
            drone_id: segment.drone_id,
            status: segment.status,
          });
        console.log('segment id:', segmentId[0]);
      }

      if (routes[i].name === 'source' || routes[i].name === 'destination') {
        const route = {
          type: routes[i].name,
          latitude: routes[i].lat,
          longitude: routes[i].lng,
        };
        // store places
        const placeId = await db('place')
          .returning('id')
          .insert({
            type: route.type,
            latitude: route.latitude,
            longitude: route.longitude,
          });
        console.log('place id:', placeId[0]);
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

/* POST tracknum */
router.post('/tracknum', async (req, res) => {
  try {
    const tracknum = req.body.id;
    const trip = await db('trip')
      .where({ tracknum })
      .select();
    console.log('trip:', trip);
    // console.log('tripid', trip[0].id)
    const tripid = trip[0].id;
    const segments = await db('segment')
      .where({ trip_id: tripid })
      .select();
    console.log('segments:', segments);
    let telemetry = {};
    for (let i = 0; i < segments.length; i += 1) {
      if (segments[i].status === 'inprogress') {
        const droneId = segments[i].drone_id;
        telemetry = await db('telemetry')
          .where({ drone_id: droneId })
          .select();
        console.log('telemetry:', telemetry);
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
