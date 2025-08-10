#!/bin/bash


docker rm -f lms-service-postgres-development || true

docker run \
    --rm \
    -p 65432:5432 \
    --name lms-service-postgres-development \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=postgres \
    -d postgres:14
