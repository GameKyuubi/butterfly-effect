# Butterfly Effect

## Summary

INSERT SUMMARY

## Technologies Used

INSERT TECHNOLOGIES USED

- [AirMap API](developer.airmap.io)
- Postgres

- Station data is collected by scraping [Wikipedia](https://en.wikipedia.org/wiki/List_of_railway_stations_in_Japan:_A) for a list of station names in Japan and then getting their latitude and longitude from the Google geocoding API.
- You can scrape the data again yourself by inserting a Google API key in `scrape-station-names.js` on line 8 and running `node scrape-station-names.js`.

## Environment & Set Up

INSERT MORE SET UP

To start:

Migrations:

add knexfile.js
npm install
npm install knex
npm install pg --save
add script for migrate and rollback migrate in package.js

For running migrate :
npm run migrate 


OR

```
yarn install
```

We are using [Airbnb style rules](http://airbnb.io/javascript/) for [ESLint](https://eslint.org/).

If you are using VSCode or SublimeText or another IDE/text editor, you can use our linter rules locally while developing. [Source1](https://github.com/Microsoft/vscode-eslint), [Source2](https://hackernoon.com/configure-eslint-prettier-and-flow-in-vs-code-for-react-development-c9d95db07213)

To test:

There are three tests that you can run: `test:eslint`, `test:stylelint`, and `test:unit`.
To run all of them, please run:
```
npm run test
```

## Issues

// where it is on trello

## Backlog

## Contributions & PR Rules

1. All pull requests must be connected to an issue/user story.
1. TESTS! You need tests.
1. At least two people on the team AND the product manager must review and accept the pull request before merging.
1. We will be following AirBnb and StyleLint styles.


