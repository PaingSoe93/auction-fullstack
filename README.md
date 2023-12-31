# Auctions Project Documentation

## Architecture

1. ** Front-end: **

   - Built using React with TypeScript.
   - Communicates with the back-end API to fetch data and execute CRUD operations.
   - Uses Docker for containerization.
   - Accessible via localhost:3000 when running locally.

2. ** Backend: **

   - Developed using NestJS.
   - Offers a RESTful API for the front-end to interact with.
   - Uses PostgreSQL as the primary database.
   - Provides Swagger-based documentation, accessible via localhost:8000/docs.
   - Dockerized for consistency in all environments.

Both front-end and back-end services are orchestrated using Docker Compose for ease of local development and testing.

## Database Schema ERD

![ERD for Auction Project!](/docs/auction.png "Entity Relationship Diagram")

## Security

1. ** Authentication & Authorization: **

   - JWT (JSON Web Tokens) based authentication is utilized.

2. ** Data Encryption: **

   - All passwords and sensitive data are encrypted before being stored in the database.
   - Data in transit (between client and server) is encrypted using HTTPS.

3. ** Other Security Measures: **

   - Input validation and sanitization to protect against SQL injections and XSS attacks.
   - Dependency check and updates to ensure no known vulnerabilities are present in the used packages.

## Deployment

- ** Deployment is automated using GitHub Actions: **
  - On every git push, a CI/CD pipeline is triggered.
  - The code is tested, built, and then pushed to a Docker registry.
  - Kubernetes configurations within the infra folder are applied to deploy the new version to a Kubernetes cluster.

## Monitoring

- Regular monitoring of application logs for errors and unexpected behaviors.

## Coding

1. ** Frontend: **

   - Modularized components following best practices for React development.
   - Components are designed to be reusable, ensuring a consistent UI and reduced redundancy.
   - Robust error handling mechanisms are in place to gracefully handle unexpected issues and provide meaningful feedback to users.
   - Components are designed to be responsive, ensuring a seamless experience across devices of varying screen sizes.

2. ** Backend: **

   - NestJS modules ensure a clean separation of concerns.
   - Services and controllers are organized according to their domain responsibilities.
   - Code is written following DRY (Don't Repeat Yourself) and SOLID principles for maintainability.

## Other Technical Aspects

- ** Swagger Documentation: ** Comprehensive API documentation and testing capabilities using Swagger. Accessible on the local environment at _ localhost:8000/docs _
- ** Infrastructure as Code: ** Kubernetes configurations are maintained within the infra folder, promoting consistent deployments and easy scaling.

## Prerequisites

Before running the application, ensure you have the following tools installed:

- ** Docker and Docker Compose: ** The project uses Docker for containerization and Docker Compose to orchestrate services.
- ** Node.js: ** Required if you're running any scripts outside of Docker.
- ** Yarn: ** The preferred package manager for the project.

### Setting Up

1. ** Clone the Repository: **

```
git clone [repository-url] auctions
cd auctions
```

2. ** How to Run **

```
docker-compose up
```

or

```
docker compose up
```

This will start all services (frontend, api, and postgres) in their respective containers.

** Frontend will be accessible via **

```
http://localhost:3000
```

** API and Swagger documentation will be accessible via **

```
http://localhost:8000

http://localhost:8000/docs
```

3. ** Stopping the Application: **

```
docker compose down
```

### Testing

** API: **

Navigate to the api directory:

```
cd api
```

Then, run:

```
yarn test
```

This will execute the NestJS testing suite.

### Troubleshooting

- ** Docker Issues: ** If you face issues related to Docker, try restarting the Docker daemon or check for any conflicting containers.
- ** Database Connections: ** Ensure that PostgreSQL is running and accepting connections. You can check its logs via Docker Compose with docker-compose logs postgres.
