using System;
using EducaNet.Application.Interfaces;
using EducaNet.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EducaNet.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            string connectionString;

            var dbUser = Environment.GetEnvironmentVariable("POSTGRES_USER");
            var dbPass = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
            var dbName = Environment.GetEnvironmentVariable("POSTGRES_DB");
            var dbHost = Environment.GetEnvironmentVariable("POSTGRES_HOST") ?? "localhost";
            var dbPort = Environment.GetEnvironmentVariable("POSTGRES_PORT") ?? "5432";

            if (!string.IsNullOrEmpty(dbUser) && !string.IsNullOrEmpty(dbPass) && !string.IsNullOrEmpty(dbName))
            {
                connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass}";
            }
            else
            {
                connectionString = configuration.GetConnectionString("DefaultConnection");
            }

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    connectionString,
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
            services.AddScoped(typeof(IGenericRepository<>), typeof(Persistence.Repositories.GenericRepository<>));

            services.AddIdentityCore<Microsoft.AspNetCore.Identity.IdentityUser>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddScoped<IJwtService, Services.JWT.JwtService>();
            services.AddScoped<IAuthService, Services.JWT.AuthService>();

            return services;
        }
    }
}
