# S3 Data Explorer Web Application

## Overview

This project is a Full-Stack Web Application for visualizing satellite data stored in an S3 bucket. The application consists of a frontend built with Next.js, Typescript, and Tailwind CSS, and a backend built with Python and FastAPI. The backend interacts with satellite data stored in an S3 bucket.

## Key Features

### Backend:

- Fetches metadata and images from an S3 bucket (MinIO).
- Provides a REST API with two endpoints:
    - `/` to list metadata and associated images.
    - `/image?name=<image_name>` to retrieve an image from the S3 bucket.

### Frontend:

- Displays images and metadata in a grid layout.
- Each image has associated metadata like `datetime`, `cloud_cover`, `sun_elevation`, and etc.
- Uses Tailwind CSS for styling.

## Tech Stack

- Frontend: Next.js (Typescript), Tailwind CSS
- Backend: Python, FastAPI
- Storage: MinIO (S3-compatible storage)
- Containerization: Docker & Docker Compose

## Prerequisites

Before running the application, ensure that the following software is installed on your system:

- Git
- Docker
- Docker Compose

## How to Run

To run the project, use Docker Compose. It will set up all necessary containers for the frontend, backend, and the S3-compatible storage.

Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

Build and start the containers using Docker Compose:

```bash
docker-compose up --build
```

This will start the following services:

- frontend: React application running on port 3000
- backend: FastAPI server running on port 5002
- s3: MinIO service for S3-compatible object storage running on port 9000
- s3-initialize: A service that initializes the S3 bucket with required data

## Access the Application

- Frontend: Open your browser and navigate to http://localhost:3000
- Backend: The FastAPI backend swagger is accessible at http://localhost:5002/docs

## S3 Storage

MinIO is running as the S3-compatible service:

S3 Console: Access the MinIO web UI at http://localhost:9001 using the following credentials:
Username: admin
Password: 12345678

## Environment Variables

Several environment variables need to be configured for the backend and S3 service. These are defined within the docker-compose.yml file.

Backend:

AWS_ENDPOINT_URL=http://s3:9000
S3_BUCKET=satellite-data
AWS_ACCESS_KEY_ID=QrLDkWufDTHARwOi0goi
AWS_SECRET_ACCESS_KEY=DbvJWi1xKPcLSGMc8kKQc3kKoXwqeOWSMIoKFJCE

S3 (MinIO):

MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=12345678

## Directory Structure:

```bash
.
├── backend/
│   ├── Dockerfile
│   ├── app/
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   └── ...
├── s3-initialize/
│   ├── initialize.sh
│   ├── testdata/
├── docker-compose.yml
└── README.md
```

backend/: Contains the FastAPI backend code
frontend/: Contains the Next.js frontend code
s3-initialize/: Holds the script (initialize.sh) to initialize the MinIO S3 bucket with data
docker-compose.yml: Configuration file to set up the Docker containers

## Licenses

The testdata uses an image from Pierre Markuse from Hamm, Germany. It is licensed under CC BY 2.0.
Image: https://commons.wikimedia.org/wiki/File:Hurricane_Larry_in_the_Atlantic_Ocean_-_September_8th,_2021_(51440099966).jpg
License text: https://creativecommons.org/licenses/by/2.0