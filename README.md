# Project Overview

This project provides a self-hosted environment for Affine, Chatwoot, and related services using Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Create an `.env` file:**

    Copy the `.env.example` (if available, otherwise create it) and fill in the necessary environment variables. The `docker-compose.yml` references several variables for database credentials, storage locations, and ports. 

    Example `.env` content:
    ```env
    PORT=3010
    UPLOAD_LOCATION=./affine_storage
    CONFIG_LOCATION=./affine_config
    DB_USERNAME=affine_user
    DB_PASSWORD=affine_password
    DB_DATABASE=affine
    DB_DATA_LOCATION=./postgres_data
    AFFINE_REVISION=stable
    # Chatwoot variables (from chatwoot/.env if it exists)
    # RAILS_ENV=production
    # ... other chatwoot variables
    ```

    **Note:** Ensure you create the directories specified by `UPLOAD_LOCATION`, `CONFIG_LOCATION`, and `DB_DATA_LOCATION` if they don't exist, or Docker will create them as files.

## Running the Services

To start all services defined in `docker-compose.yml`:

```bash
docker-compose up -d
```

This command will build (if necessary), create, and start all containers in the background.

## Services Overview

This `docker-compose.yml` orchestrates the following services:

-   **affine**: The main Affine GraphQL server.
    -   **Port**: `${PORT:-3010}:3010` (default: `3010`)
    -   **Dependencies**: `redis`, `postgres`, `affine_migration`
-   **affine_migration**: A job to run database migrations for Affine.
-   **redis**: A Redis instance used by Affine.
-   **postgres**: A PostgreSQL database with `pgvector` support, used by Affine.
-   **tenant-config**: A service for tenant-specific configurations.
    -   **Port**: `4000:4000`
-   **wrapper-frontend**: The frontend application.
    -   **Port**: `5173:5173`
-   **chatwoot_rails**: The main Chatwoot Rails application.
    -   **Port**: `127.0.0.1:3000:3000`
    -   **Dependencies**: `chatwoot_postgres`, `chatwoot_redis`
-   **chatwoot_sidekiq**: Sidekiq worker for Chatwoot background jobs.
-   **chatwoot_postgres**: A PostgreSQL database with `pgvector` support, used by Chatwoot.
    -   **Port**: `127.0.0.1:5433:5432`
-   **chatwoot_redis**: A Redis instance used by Chatwoot.
    -   **Port**: `127.0.0.1:6380:6379`

## Accessing Services

Once the services are running, you can access them at:

-   **Affine**: `http://localhost:3010` (or your specified `PORT`)
-   **Tenant Config**: `http://localhost:4000`
-   **Wrapper Frontend**: `http://localhost:5173`
-   **Chatwoot**: `http://localhost:3000`

## Stopping the Services

To stop and remove all containers, networks, and volumes created by `docker-compose.yml`:

```bash
docker-compose down -v
```

To stop only the containers without removing them:

```bash
docker-compose stop
```

## Individual Service Deployment

For instructions on how to deploy each major service (Affine, Chatwoot, Tenant Config, Wrapper Frontend) independently, refer to their respective `README.md` files located in their dedicated directories:

-   `./affine/README.md`
-   `./chatwoot/README.md`
-   `./tenant-config/README.md`
-   `./wrapper-frontend/README.md`

## navigation 
- open ``` localhost:5713/ for choosing your org```
- open ``` localhost:5713/admin/ for admin view for creating , updating,deleting ```

### before setting teenat please set up you secret key and org in chatboot ui 
