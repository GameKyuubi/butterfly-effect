// helper methods for db access

/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-mixed-operators */
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

const storeTrip = async (trip) => {
  const tripResult = await db('trip')
    .returning('id')
    .insert({
      tracknum: trip.tracknum,
      status: trip.status,
    });
  console.log('tripResult:', tripResult[0]);
  return tripResult[0];
};

const storeSegments = async (segment) => {
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
  return segmentId[0];
};

const storePlaces = async (route) => {
  const placeId = await db('place')
    .returning('id')
    .insert({
      type: route.type,
      latitude: route.latitude,
      longitude: route.longitude,
    });
  console.log('place id:', placeId[0]);
  return placeId[0];
};

const getTrip = async (tracknum) => {
  const trip = await db('trip')
    .where({ tracknum })
    .select();
  console.log('trip:', trip);
  return trip[0];
};

const getSegments = async (tripId) => {
  const segments = await db('segment')
    .where({ trip_id: tripId })
    .select();
  console.log('segments:', segments);
  return segments;
};

const getTelemetry = async (droneId) => {
  const telemetry = await db('telemetry')
    .where({ drone_id: droneId })
    .select();
  console.log('telemetry:', telemetry);
  return telemetry;
};

module.exports = { getStations, storeTrip, storeSegments, storePlaces, getTrip, getSegments, getTelemetry };
