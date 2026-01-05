# EducaNet

EducaNet is a comprehensive course and lesson management system built with .NET 8 and React.

## Prerequisites

- .NET 8 SDK
- Node.js 20+
- Docker & Docker Compose (optional, for containerized execution)
- PostgreSQL (Cloud or Local)

## Database Configuration

The application uses PostgreSQL. To configure the database:

1.  Update the connection string in `src/EducaNet.API/appsettings.json` or via environment variables:
    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Host=your-host;Database=EducaNet;Username=your-user;Password=your-password"
    }
    ```
2.  The database is currently configured to connect to a cloud instance.

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

1.  Ensure your cloud database is accessible.
2.  Run `docker-compose up --build`.
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
