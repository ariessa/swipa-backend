<h1 align="center">Swipa Backend</h1>

<p align="center">  
❤️ Swipa Backend is the backend part of Swipa, a dating app.
</p>

<br />

## Entity Relationship Diagram

<p align="center">
<img src="/previews/swipa_erd.png"/>
</p>

</br>

## Prerequisites
All installation instructions are geared for macOS Apple Silicon system. By default, all UNIX-based and Linux-based system are already installed with `make`.

For Windows system, `make` can be installed using 3 ways:

- Using Make for Windows
- Using `chocolatey` to install make
- Using Windows Subsystem for Linux (WSL2)

<br />

## How to run it locally

- Clone repository

    ```
    git clone git@github.com:ariessa/swipa-backend.git
    ```

- Create `.env` file and insert values

    ```
    BACKEND_PORT=""
    POSTGRES_HOST=""
    POSTGRES_PORT=""
    POSTGRES_DATABASE=""
    POSTGRES_USER="postgres"
    POSTGRES_PASSWORD=""
    FRONTEND_DEV_URL=""
    ```

- Build and start all Docker containers

    ```
    make up
    ```

<br />

## How to run the tests

- Get a list of unit tests and their verbose results

    ```
    make tests
    ```

    <p align="center">
    <img src="/previews/verbose-test.png"/>
    </p>

- Get test coverage

    ```
    make tests-coverage
    ```

    <p align="center">
    <img src="/previews/test-coverage.png"/>
    </p>

<br />

## Useful Commands

- Run SQL query inside containerised PostgreSQL database

    ```
    # Start a Bash shell inside Docker container 'swipa-database'
    docker exec -it swipa-database /bin/bash

    # Switch the user to the 'postgres' user within the Docker container
    su - postgres

    # Open PostgreSQL CLI
    psql

    # Connect to database 'swipa'
    \c swipa

    # Run query
    # Example: select * from users;
    select <column(s)> from <table>;
    ```

<br />
