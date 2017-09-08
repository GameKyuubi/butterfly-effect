const AirspaceChecker = require('./lib/AirspaceChecker');
const express = require('express');
const fetch = require('isomorphic-fetch');
const querystring = require('querystring');

const router = express.Router();

module.exports = (services) => {
  /* GET stations listing. */
  router.get('/stations', async (req, res) => {
    try {
      const stations = await services.db.stations.list();
      res.status(200).send(stations);
    } catch (err) {
      throw err;
    }
  });

  router.get('/checksegment', (req, res, next) => {
    const result = AirspaceChecker.checkSpace(origin, dest);
    res.json(result);
  });

  router.get('/fakechecksegment', (req, res, next) => {
    const result = FakeAirspaceChecker.checkSpace(origin, dest);
    res.json(result);
  });

  module.exports = router;
  return router;
};
