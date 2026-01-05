# EducaNet

EducaNet is a comprehensive course and lesson management system built with .NET 8 and React.

## Prerequisites

- .NET 8 SDK
- Node.js 20+
- Docker & Docker Compose (optional, for containerized execution)
- PostgreSQL (Cloud or Local)

## Database Configuration

The application uses PostgreSQL. To configure the database:

1.  Create a `.env` file in the root directory by copying the `.env.example` file:
    ```bash
    cp .env.example .env
    ```
2.  Open the `.env` file and update the database connection details with your actual cloud or local PostgreSQL credentials.
3.  The application will automatically use these variables for both local execution and Docker.

## Migrations

To apply database migrations, run the following command from the root directory:

```bash
dotnet ef database update --project src/EducaNet.Infrastructure --startup-project src/EducaNet.API
```

## Running the Application

### Local Development

#### API
1.  Navigate to `src/EducaNet.API`.
2.  Run `dotnet run`.
3.  The API will be available at `http://localhost:5000`.

#### Frontend
1.  Navigate to `EducaNet.Web`.
2.  Run `npm install`.
3.  Run `npm run dev`.
4.  The frontend will be available at `http://localhost:5173`.

### Using Docker Compose

To run the entire application using Docker:

1.  Ensure you have created and configured your `.env` file as described above.
2.  Run the following command from the root directory:
    ```bash
    docker compose up --build
    ```
3.  The API will be at `http://localhost:5000` and the Web frontend at `http://localhost:3000`.

## Test User Credentials

- **Email**: `admin@educanet.com`
- **Password**: `Admin123!`

## Project Structure

- `src/EducaNet.Domain`: Entities and Enums.
- `src/EducaNet.Application`: DTOs, Interfaces, and Services.
- `src/EducaNet.Infrastructure`: Persistence (EF Core) and Repositories.
- `src/EducaNet.API`: Controllers and API Configuration.
- `EducaNet.Web`: React (Vite) Frontend.
- `EducaNet.Tests`: Unit Tests.
