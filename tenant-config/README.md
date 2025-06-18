# Tenant Config Service

This directory contains the `tenant-config` service, which is responsible for managing tenant-specific configurations.

## Overview

This service is a Docker container built from the `tenant-config` directory as specified in the main `docker-compose.yml` file.

## Configuration

-   **Volumes**: It mounts a local `data` directory into the container at `/usr/src/app/data`. This allows for persistent storage of configuration data.
    ```yaml
    volumes:
      - ./tenant-config/data:/usr/src/app/data
    ```
-   **Ports**: The service exposes port `4000` from the container to port `4000` on the host.
    ```yaml
    ports:
      - "4000:4000"
    ```

## Running the Service (Standalone)

To run this service individually without the entire Docker Compose setup, you can use the following steps:

1.  **Navigate to the service directory:**

    ```bash
    cd tenant-config
    ```

2.  **Build the Docker image (if not already built by `docker-compose up`):**

    ```bash
    docker build -t tenant-config .
    ```

3.  **Run the Docker container:**

    ```bash
    docker run -d -p 4000:4000 -v $(pwd)/data:/usr/src/app/data --name tenant-config-standalone tenant-config
    ```

## Accessing the Service

Once the service is running, you can access it at `http://localhost:4000`. 