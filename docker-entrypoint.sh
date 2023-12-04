#!/bin/sh

/usr/local/bin/dockerize -wait tcp://db:5432 -wait tcp://redis:6379 -timeout 20s

npx prisma migrate deploy

npm run build

npm run start:prod
