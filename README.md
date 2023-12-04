# Nest.js API - Test Gen

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">  A Nest.js-powered API designed for efficient and scalable management of products within a product management system. The API offers essential features for handling products and related information with a focus on RESTful endpoints and authentication.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Table of Contents

- [Nest.js API - Test Gen](#nestjs-api---test-gen)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
    - [Login Doc](#login-doc)
    - [User Test for API](#user-test-for-api)
  - [API Access](#api-access)
  - [Installation with Docker](#installation-with-docker)
  - [Installation without Docker](#installation-without-docker)
    - [Prisma](#prisma)
    - [Running the app](#running-the-app)
  - [Test](#test)
  - [Support](#support)
  - [Stay in touch](#stay-in-touch)
  - [License](#license)

## Description

This Nest.js API serves as a backend for a product management system. It is built with a focus on efficiency and scalability, providing RESTful endpoints for managing products. The API includes authentication, and you can find the API documentation with Swagger at [https://testgen.onrender.com/docs](https://testgen.onrender.com/docs).

### Login Doc

- **Username:** test-gen
- **Password:** 123

### User Test for API

- **Email:** <bruno-151299@hotmail.com>
- **Password:** bruno123

**Add Authorization Header:** Bearer + accessToken

## API Access

- **API URL:** [https://testgen.onrender.com/v1](https://testgen.onrender.com/v1)

## Installation with Docker

Initiate the project using [Docker](https://www.docker.com/get-started/):

```bash
docker-compose up --build -d
```

## Installation without Docker

Install dependencies using the package manager [pnpm](https://pnpm.io/):

```bash
pnpm install
```

### Prisma

Utilize [Prisma](https://www.prisma.io/nestjs) with Nest.js to set up the database:

```bash
npx prisma migrate dev
```

### Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Test

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## Support

Test Gen is an open-source project licensed under the MIT License, fueled by your invaluable support. Contribute to the project's enhancement by initiating a pull request on [GitHub](https://github.com/brgarcias/test-gen/pulls "PR Test Gen"). Your collaboration is greatly appreciated!

## Stay in touch

- Email - *<bruno-151299@hotmail.com>*
- Website - [Portfolio](https://brgarcias-portfolio.netlify.app/ "portfolio")

## License

Test Gen is [MIT licensed](LICENSE).
