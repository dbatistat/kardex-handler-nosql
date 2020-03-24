# Kardex - Solution

## Members

- Brenda Lopez
- David Batista

## Assignment IV - Kardex
Read carefully the assignment instructions

Note: For this assignment you can work in pairs

Excercise: [Download](https://drive.google.com/open?id=1r_VOTZ6mGDl8WCkO4UfonBSn4ej-oO--)

### Description

#### Architecture
![kardex-architecture](https://user-images.githubusercontent.com/6003785/77384016-bfc40400-6d5a-11ea-815b-46c9bd0b683a.jpeg)

#### This project was solved using the following patterns:
- CQRS
- Event Sourcing
- Microservices

#### For this project it was used:
- NestJs
- RabbitMQ
- MongoDB
- SQLite

#### It is made up of the following projects:
- [kardex-command](https://github.com/dbatistat/kardex-command): This project is in charge of executing all the transactions in kardex, it has implemented the end points to register and modify a transaction.

- [kardex-query](https://github.com/dbatistat/kardex-query): This project is only used to perform queries that the system may require, for this case only the getAll() end point has been implemented.

- [kardex-handler-sql](https://github.com/dbatistat/kardex-handler-sql): It is in charge of making create and modify the transactions with their respective validations to a relational database. It was created with the purpose of taking the time to create one by one the transactions as the RabbitMQ queue sends them.

- [kardex-handle-nosql](https://github.com/dbatistat/kardex-handler-nosql): It is in charge of creating and calculating the quick view of the kardex, having data calculated for a quick consultation.

#### TODO: 
- Controllers validations
- Error handling
- Rabbit MQ fixes

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```



