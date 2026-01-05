using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using DotNetEnv;

namespace EducaNet.Infrastructure.Persistence
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // Load .env file
            string? envPath = FindEnvFile(Directory.GetCurrentDirectory());
            if (!string.IsNullOrEmpty(envPath))
            {
                Env.Load(envPath);
            }

            // Build connection string from environment variables
            var dbUser = Environment.GetEnvironmentVariable("POSTGRES_USER") ?? "postgres";
            var dbPass = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD") ?? "postgrespassword";
            var dbName = Environment.GetEnvironmentVariable("POSTGRES_DB") ?? "EducaNet";
            var dbHost = Environment.GetEnvironmentVariable("POSTGRES_HOST") ?? "localhost";
            var dbPort = Environment.GetEnvironmentVariable("POSTGRES_PORT") ?? "5432";

            var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass}";

            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
            builder.UseNpgsql(connectionString);

            return new ApplicationDbContext(builder.Options);
        }

        private string? FindEnvFile(string currentPath)
        {
            var filePath = Path.Combine(currentPath, ".env");
            if (File.Exists(filePath))
            {
                return filePath;
            }

            var parentDir = Directory.GetParent(currentPath);
            if (parentDir != null)
            {
                return FindEnvFile(parentDir.FullName);
            }

            return null;
        }
    }
}
