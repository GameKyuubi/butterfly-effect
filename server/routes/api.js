const AirspaceChecker = require('./lib/AirspaceChecker');
const express = require('express');
const fetch = require('isomorphic-fetch');
const querystring = require('querystring');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.json({ page: 'Api' });
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
