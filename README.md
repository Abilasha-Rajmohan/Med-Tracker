# CS6440 Team 86

# Symptom and Side Effect Tracker: Bridging Patients and Providers for Enhanced Healthcare Outcomes

## Folder Structure

The repository is organized into two main directories:

- **Backend**: Contains the FastAPI backend application, the Database query script, and the setup script.
- **Frontend**: Contains the Next.js frontend application and the setup script.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- [Docker](https://www.docker.com/)

#### Start Docker

Make sure Docker is running before executing the setup scripts. On most systems, you can start Docker with:

- On Linux:
  ```bash
  sudo systemctl start docker
  ```

- On macOS or Windows: Open the Docker Desktop application.

---

## Deployment Instructions

### Setting up the Backend

1. Navigate to the Backend directory.
2. Execute the startProject.sh script
   ```bash
   ./startProject.sh
   ```
3. Once the setup is complete, the backend will be accessible at: `http://localhost:8000`. The Swagger documentation will be accessible at `http://localhost:8000/docs`.

### Setting up the Frontend

1. Navigate to the Frontend directory.
2. Execute the startClient.sh script
   ```bash
   ./startClient.sh
   ```
3. Once the setup is complete, the frontend will be accessible at: `http://localhost:3000`.
