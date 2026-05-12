# Node.js Thesis Comparator

REST backend built with Node.js, TypeScript, Fastify, Express, and Sequelize for architectural and functional comparison
with the [Spring Boot](https://github.com/RikyRasera3/thesis-springboot) application.

## Purpose

The application exposes a set of endpoints for account management and server status checks. Its behavior will remain 
aligned with the Spring Boot counterpart so that structure, logic, performance, and output can be compared consistently.

## Technology Stack

- [Node.js 24](https://nodejs.org/en/blog/release/v24.0.0)
- [TypeScript 6](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [Fastify 5](https://fastify.dev/docs/v5.0.x/)
- [Express 5](https://expressjs.com/2024/10/15/v5-release.html)
- [Sequelize 7](https://sequelize.org/docs/v7/) with [PostgreSQL](https://www.postgresql.org/) dialect
- [class-validator](https://www.npmjs.com/package/class-validator) and [class-transformer-validator](https://www.npmjs.com/package/class-transformer-validator) for validation
- [Log4js](https://www.npmjs.com/package/log4js)

## Prerequisites

- Node.js 24 and npm for local development
- Docker for containerized execution

## Available npm Scripts

- `npm run ci`: Installs dependencies with based on `package-lock.json` dependency tree
- `npm run build`: Compiles TypeScript into `dist/` folder
- `npm run dev`: Starts the development server with `nodemon`
- `npm run start`: Runs the compiled build from `dist/main.js`

## Database Notes

Refer to the [README.md](database/README.md) file of `database/` folder for database setup

## Docker

The Node.js module includes both a `Dockerfile` and a `docker-compose.yml`.
The Compose setup starts the `app` service, which builds the `thesis-nodejs-app` image and runs the `thesis-nodejs-app`
container from [Dockerfile](Dockerfile).
Use these commands from the `thesis-nodejs/` directory to manage the Docker setup:

### Build the image

```bash
docker compose build
```

### Start the container

```bash
docker compose up -d
```
### Stop and remove the container

```bash
docker compose down
```

## Project Structure

```text
src/
  application/   Server and database bootstrap
  controller/    HTTP request handlers
  dto/           Request/response DTOs and validation criteria
  exception/     Custom exceptions
  handler/       validation and error-handling middleware
  model/         Sequelize models
  route/         Endpoint definitions
  service/       Application logic and model access
  util/          Shared utilities
```

## Install Dependencies

```bash
npm ci
```

## Run in Development

```bash
npm run dev
```

This command uses [nodemon](https://www.npmjs.com/package/nodemon) and [ts-node](https://www.npmjs.com/package/ts-node),
so the server automatically restarts whenever TypeScript files change.

## Build and Run

Build the project:

```bash
npm run build
```

Run the compiled application:

```bash
npm run start
```

## Quick Service Check

Health endpoint:

```bash
curl http://localhost:3000/server
```

Expected response:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

Ping endpoint:

```bash
curl http://localhost:3000/server/ping
```

Expected response:

```json
{
  "message": "pong"
}
```

## Available APIs
### Server

- `GET /server`
- `GET /server/ping`

### Account

- `GET /accounts/search`
- `GET /accounts`
- `GET /accounts/:id`
- `POST /accounts`
- `PATCH /accounts/:id`
- `DELETE /accounts/:id`

## Payloads and Parameters
### `GET /accounts/search`

Supported query parameters:

- `page`: page index, default `0`
- `size`: page size, default `10`
- `roleIds`: a single role id or a comma-separated list, for example `1` or `1,2,3`

Example:

```bash
curl "http://localhost:3000/accounts/search?page=0&size=10&roleIds=1,2"
```

Note: the `totalPages` field is calculated using `Math.ceil(totalElements / size)`.

### `GET /accounts`

Supported query parameters:

- `roleIds`: a single role id or a comma-separated list

Example:

```bash
curl "http://localhost:3000/accounts?roleIds=1,2"
```

### `GET /accounts/:id`

Example:

```bash
curl http://localhost:3000/accounts/1
```

### `POST /accounts`

Required body:

```json
{
  "name": "Mario",
  "surname": "Rossi",
  "email": "mario.rossi@example.com",
  "phone": "+390123456789",
  "dateOfBirth": "1995-05-20T00:00:00.000Z"
}
```

Example:

```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mario",
    "surname": "Rossi",
    "email": "mario.rossi@example.com",
    "phone": "+390123456789",
    "dateOfBirth": "1995-05-20T00:00:00.000Z"
  }'
```

### `PATCH /accounts/:id`

Required body:

```json
{
  "email": "mario.rossi.updated@example.com"
}
```

Example:

```bash
curl -X PATCH http://localhost:3000/accounts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mario.rossi.updated@example.com"
  }'
```

### `DELETE /accounts/:id`

Example:

```bash
curl -X DELETE http://localhost:3000/accounts/1
```

## Test Environment

Tests have been executed deploying the container into a 
[Cloud Run](https://cloud.google.com/run?_gl=1*gpb51k*_up*MQ..&gclid=CjwKCAjwzLHPBhBTEiwABaLsSnKN_mvr7If9AkAgTHfVeFSFXSuNmwhm30SYU3zVQobJGYhkHR6H4hoCgqEQAvD_BwE&gclsrc=aw.ds)
instance of 
[Google Cloud Platform](https://cloud.google.com/?_gl=1*1o4sew4*_up*MQ..&gclid=CjwKCAjw5NvPBhAoEiwA_2egfqYaZpsdEUY6ez7ypP25M9AE5FgZq5TuEzXZf3387FQGYbhOQmVs-xoC02cQAvD_BwE&gclsrc=aw.ds) 
with the following configurations:

### Configurations

- 1 vCPU
- 1 GiB RAM
