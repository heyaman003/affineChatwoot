# Wrapper Frontend Service

This directory contains the `wrapper-frontend` service, which is the frontend application for the project.

## Overview

This service is a Docker container built from the `wrapper-frontend` directory as specified in the main `docker-compose.yml` file.

## Configuration

-   **Ports**: The service exposes port `5173` from the container to port `5173` on the host.
    ```yaml
    ports:
      - "5173:5173"
    ```
-   **Volumes**: It mounts the local `wrapper-frontend` directory into the container at `/usr/src/app/frontend`.
    ```yaml
    volumes:
      - ./wrapper-frontend:/usr/src/app/frontend
      - /usr/src/app/frontend/node_modules
    ```
    The second volume definition (`/usr/src/app/frontend/node_modules`) is to ensure that `node_modules` are not overwritten by the host volume mount, allowing Docker to manage them internally.
-   **Environment Variables**:
    -   `CHOKIDAR_USEPOLLING: "true"`: Often used in Docker environments to enable polling for file changes, which can be necessary for hot-reloading to work correctly when host file changes aren't propagated directly.
    -   `ROLLUP_NO_BINARY_BUILD: "true"`: This might be specific to the build process within the frontend project, potentially related to preventing native module compilation issues in a Docker environment.

## Running the Service (Standalone)

To run this service individually without the entire Docker Compose setup, you can use the following steps:

1.  **Navigate to the service directory:**

    ```bash
    cd wrapper-frontend
    ```

2.  **Build the Docker image (if not already built by `docker-compose up`):**

    ```bash
    docker build -t wrapper-frontend .
    ```

3.  **Run the Docker container:**

    ```bash
    docker run -d -p 5173:5173 -v $(pwd):/usr/src/app/frontend -e CHOKIDAR_USEPOLLING="true" -e ROLLUP_NO_BINARY_BUILD="true" --name wrapper-frontend-standalone wrapper-frontend
    ```

## Accessing the Service

Once the service is running, you can access the frontend application at `http://localhost:5173`.
