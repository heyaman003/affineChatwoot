# Chatwoot Services

This directory contains configurations and environment files for the Chatwoot services integrated into the main Docker Compose setup.

## Overview

The `docker-compose.yml` orchestrates two main Chatwoot services:

-   **chatwoot_rails**: The primary Rails application for Chatwoot.
-   **chatwoot_sidekiq**: A Sidekiq worker for processing background jobs in Chatwoot.

Additionally, there are dedicated PostgreSQL and Redis services for Chatwoot:

-   **chatwoot_postgres**: PostgreSQL database for Chatwoot.
-   **chatwoot_redis**: Redis instance for Chatwoot.

## Configuration

### Environment Variables (`chatwoot/.env`)

The Chatwoot services (both `chatwoot_rails` and `chatwoot_sidekiq`) rely on an environment file located at `chatwoot/.env`. You **must** create this file and populate it with the necessary Chatwoot specific environment variables. An example `chatwoot/.env` might look like this (refer to Chatwoot's official documentation for a complete list of required variables):

```env
RAILS_ENV=production
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
# Database configuration
POSTGRES_HOST=chatwoot_postgres
POSTGRES_PORT=5432
POSTGRES_USERNAME=chatwoot
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=chatwoot_production
# Redis configuration
REDIS_URL=redis://:Aman1234@chatwoot_redis:6379/0
REDIS_HOST=chatwoot_redis
REDIS_PORT=6379
REDIS_PASSWORD=Aman1234
# Secret key base (generate a strong one!)
SECRET_KEY_BASE=your_very_long_and_secure_secret_key_base
# Storage configuration
STORAGE_TYPE=local
# ... other Chatwoot specific variables
```

### Ports

-   **chatwoot_rails**: Maps `127.0.0.1:3000` on the host to `3000` in the container. This means Chatwoot will be accessible locally only.
    ```yaml
    ports:
      - '127.0.0.1:3000:3000'
    ```
-   **chatwoot_postgres**: Maps `127.0.0.1:5433` on the host to `5432` in the container.
    ```yaml
    ports:
      - '127.0.0.1:5433:5432'
    ```
-   **chatwoot_redis**: Maps `127.0.0.1:6380` on the host to `6379` in the container.
    ```yaml
    ports:
      - '127.0.0.1:6380:6379'
    ```

### Volumes

-   **chatwoot_storage**: Used for persistent storage of Chatwoot files (e.g., attachments).
    ```yaml
    volumes:
      - chatwoot_storage:/app/storage
    ```
-   **chatwoot_postgres_data**: For persistent PostgreSQL database data.
    ```yaml
    volumes:
      - chatwoot_postgres_data:/var/lib/postgresql/data
    ```
-   **chatwoot_redis_data**: For persistent Redis data.
    ```yaml
    volumes:
      - chatwoot_redis_data:/data
    ```

## Running Chatwoot (Standalone)

Running Chatwoot entirely standalone (outside of the main `docker-compose.yml`) involves more steps, as it requires its own database and Redis instances, and correct environment variable setup. The recommended way to run Chatwoot is via its own `docker-compose.yml` as per their official documentation, or through the provided main `docker-compose.yml` in this project.

However, if you wish to run *only* the Chatwoot services provided in this setup, you would typically use a separate `docker-compose.yml` file that defines only the `chatwoot_rails`, `chatwoot_sidekiq`, `chatwoot_postgres`, and `chatwoot_redis` services. 

**Example `docker-compose.chatwoot.yml` (simplified):**

```yaml
version: "3.8"

services:
  chatwoot_rails:
    image: chatwoot/chatwoot:latest
    env_file: chatwoot/.env
    depends_on:
      - chatwoot_postgres
      - chatwoot_redis
    ports:
      - '127.0.0.1:3000:3000'
    environment:
      - NODE_ENV=production
      - RAILS_ENV=production
      - INSTALLATION_ENV=docker
      - DISABLE_X_FRAME_HEADER=true  
    entrypoint: docker/entrypoints/rails.sh
    command: ['bundle', 'exec', 'rails', 's', '-p', '3000', '-b', '0.0.0.0']
    volumes:
      - chatwoot_storage:/app/storage
    restart: always

  chatwoot_sidekiq:
    image: chatwoot/chatwoot:latest
    env_file: chatwoot/.env
    depends_on:
      - chatwoot_postgres
      - chatwoot_redis
    environment:
      - NODE_ENV=production
      - RAILS_ENV=production
      - INSTALLATION_ENV=docker
    command: ['bundle', 'exec', 'sidekiq', '-C', 'config/sidekiq.yml']
    volumes:
      - chatwoot_storage:/app/storage
    restart: unless-stopped

  chatwoot_postgres:
    image: pgvector/pgvector:pg16
    restart: unless-stopped
    ports:
      - '127.0.0.1:5433:5432'  
    volumes:
      - chatwoot_postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=chatwoot_production
      - POSTGRES_USER=chatwoot
      - POSTGRES_PASSWORD=password
      - POSTGRES_HOST_AUTH_METHOD=trust

  chatwoot_redis:
    image: redis:alpine
    restart: unless-stopped
    command: redis-server --requirepass Aman1234
    volumes:
      - chatwoot_redis_data:/data
    ports:
      - '127.0.0.1:6380:6379'  
    healthcheck:
        test: ["CMD", "redis-cli", "-a", "Aman1234", "ping"]
        interval: 10s
        timeout: 5s
        retries: 5

volumes:
  chatwoot_storage:
  chatwoot_postgres_data:
  chatwoot_redis_data:
```

To run this simplified Chatwoot setup:

1.  **Save the above content** as `docker-compose.chatwoot.yml` in the project root.
2.  **Create the `chatwoot/.env` file** as described above.
3.  **Run Docker Compose:**

    ```bash
    docker-compose -f docker-compose.chatwoot.yml up -d
    ```

## Accessing Chatwoot

Once the services are running, you can access Chatwoot at `http://localhost:3000`. 