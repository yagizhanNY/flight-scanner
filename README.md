## Flight Scanner API

This API gets flights from multiple sources and merge them.

### Before run the API

#### Redis

Host and port informations of Redis must be provided in `.env` file. Default values are;

```text
REDIS_URL=localhost
REDIS_PORT=6379
```

#### Flight sources

Flight sources are stored under `src/resources/flight-sources.json` file. Flight sourcess can be added into this file. User can change the file name in .env file. Default value is;

```text
FLIGHT_SOURCES_FILE_NAME=flight-sources.json
```

---

### Setup

- Clone repository

```terminal
git clone https://github.com/yagizhanNY/flight-scanner.git
```

- Locate to the project source

```terminal
cd flight-scanner
```

- Install dependencies

```terminal
npm install --legacy-peer-deps
```

- Create .env file or export listed variables before run the app.

```text
REDIS_URL={{REDIS_URL}}
REDIS_PORT={{REDIS_PORT}}
FLIGHT_SOURCES_FILE_NAME={{FILE_NAME}}
```

- To start the API

```terminal
npm run start
```

---

### Tests

To run the all unit tests

```terminal
npm run test
```

---

# API Endpoints

### GET

```text
/flights
```

**Response**

```json
{
  "flights": [
    {
      "slices": [
        {
          "origin_name": "Schonefeld",
          "destination_name": "Stansted",
          "departure_date_time_utc": "2019-08-08T16:00:00.000Z",
          "arrival_date_time_utc": "2019-08-08T17:55:00.000Z",
          "flight_number": "146",
          "duration": 115
        },
        {
          "origin_name": "Stansted",
          "destination_name": "Schonefeld",
          "departure_date_time_utc": "2019-08-10T18:00:00.000Z",
          "arrival_date_time_utc": "2019-08-10T20:00:00.000Z",
          "flight_number": "8544",
          "duration": 120
        }
      ],
      "price": 130.1
    },
    {
      "slices": [
        {
          "origin_name": "Schonefeld",
          "destination_name": "Stansted",
          "departure_date_time_utc": "2019-08-08T20:25:00.000Z",
          "arrival_date_time_utc": "2019-08-08T22:25:00.000Z",
          "flight_number": "8545",
          "duration": 120
        },
        {
          "origin_name": "Stansted",
          "destination_name": "Schonefeld",
          "departure_date_time_utc": "2019-08-10T06:50:00.000Z",
          "arrival_date_time_utc": "2019-08-10T08:40:00.000Z",
          "flight_number": "145",
          "duration": 110
        }
      ],
      "price": 134.81
    },
    {
      "slices": [
        {
          "origin_name": "Schonefeld",
          "destination_name": "Stansted",
          "departure_date_time_utc": "2019-08-08T08:00:00.000Z",
          "arrival_date_time_utc": "2019-08-08T10:00:00.000Z",
          "flight_number": "264",
          "duration": 110
        },
        {
          "origin_name": "Stansted",
          "destination_name": "Schonefeld",
          "departure_date_time_utc": "2019-08-10T18:00:00.000Z",
          "arrival_date_time_utc": "2019-08-10T20:00:00.000Z",
          "flight_number": "265",
          "duration": 100
        }
      ],
      "price": 152.36
    },
    {
      "slices": [
        {
          "origin_name": "Schonefeld",
          "destination_name": "Stansted",
          "departure_date_time_utc": "2019-08-08T20:25:00.000Z",
          "arrival_date_time_utc": "2019-08-08T22:25:00.000Z",
          "flight_number": "1253",
          "duration": 125
        },
        {
          "origin_name": "Stansted",
          "destination_name": "Schonefeld",
          "departure_date_time_utc": "2019-08-10T05:35:00.000Z",
          "arrival_date_time_utc": "2019-08-10T07:35:00.000Z",
          "flight_number": "1254",
          "duration": 124
        }
      ],
      "price": 154.26
    }
  ]
}
```
