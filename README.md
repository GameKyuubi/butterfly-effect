# Butterfly Effect

## Summary
A mock drone delivery service using AirMap API

## Technologies Used
- [AirMap API](https://developers.airmap.com/)
- Postgres, knex
- Node/Express
- Chai
- React.js([create-react-app](https://github.com/facebookincubator/create-react-app), [react-google-maps](https://github.com/tomchentw/react-google-maps)), Redux
- google-material-ui
- scraping
  - Station data is collected by scraping [Here](https://en.wikipedia.org/wiki/List_of_railway_stations_in_Japan:_A) for a list of station names in Japan and then getting their latitude and longitude from the Google geocoding API.
  - You can scrape the data again yourself by inserting a Google API key in `scrape-station-names.js` on line 8 and running `node scrape-station-names.js`.

## Environment & Set Up
To start:
This includes migration as well 
```
npm install
```
OR
```
yarn install
```
To populate preset-data:(Should run only once)
```
cd scripts
node populate-stations.js
node populate-drones.js
```

## Running tests
There are three tests that you can run: `test:eslint`, `test:stylelint`, and `test:unit`.
To run all of them, please run:
```
npm run test
```

## Linting
We are using [Airbnb style rules](http://airbnb.io/javascript/) for [ESLint](https://eslint.org/).

If you are using VSCode or SublimeText or another IDE/text editor, you can use our linter rules locally while developing. [Source1](https://github.com/Microsoft/vscode-eslint), [Source2](https://hackernoon.com/configure-eslint-prettier-and-flow-in-vs-code-for-react-development-c9d95db07213)


## Issues

// where it is on trello

## Backlog

## Contributions & PR Rules
1. All pull requests must be connected to an issue/user story.
1. TESTS! You need tests.
1. At least two people on the team AND the product manager must review and accept the pull request before merging.
1. We will be following AirBnb and StyleLint styles.


