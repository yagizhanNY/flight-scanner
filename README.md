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
npm start
```

---

### Tests

To run the all unit tests

```terminal
npm run test
```
