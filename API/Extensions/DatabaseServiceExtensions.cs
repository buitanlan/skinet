using Core.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace API.Extensions;

public static class DatabaseServiceExtensions
{
    public static IServiceCollection AddDatabaseServices(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        if (environment.IsDevelopment())
        {
            services.AddDbContextPool<StoreContext>(options =>
                options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

            services.AddDbContext<AppIdentityDbContext>(options =>
                options.UseSqlite(configuration.GetConnectionString("IdentityConnection")));
        }
        else
        {
            services.AddDbContextPool<StoreContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddDbContext<AppIdentityDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("IdentityConnection")));
        }

        return services;
    }

    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;

        try
        {
            var context = services.GetRequiredService<StoreContext>();
            var identityContext = services.GetRequiredService<AppIdentityDbContext>();

            if (app.Environment.IsDevelopment())
            {
                await context.Database.EnsureCreatedAsync();
                await identityContext.Database.EnsureCreatedAsync();
            }
            else
            {
                await context.Database.MigrateAsync();
                await identityContext.Database.MigrateAsync();
            }

            await StoreContextSeed.SeedAsync(context);

            var userManager = services.GetRequiredService<UserManager<AppUser>>();
            var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
            await AppIdentityDbContextSeed.SeedUsersAsync(userManager, roleManager);
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "An error occurred during migration");
        }
    }
}
