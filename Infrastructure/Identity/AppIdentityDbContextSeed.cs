using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity;

public class AppIdentityDbContextSeed
{
    public static async Task SeedUsersAsync(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        if (!await userManager.Users.AnyAsync())
        {
            var users = new List<AppUser>
                {
                    new()
                    {
                        DisplayName = "Bob",
                        Email = "bob@test.com",
                        UserName = "bob@test.com",
                        Address = new Address
                        {
                            FirstName = "Bob",
                            LastName = "Bobbity",
                            Street = "10 Thw Street",
                            City = "New York",
                            State = "NY",
                            ZipCode = "90210"
                        }
                    },
                    new()
                    {
                        DisplayName = "Admin",
                        Email = "admin@test.com",
                        UserName = "admin@test.com"
                    }

                };

            var roles = new List<AppRole>
                {
                    new() { Name = "Admin"},
                    new() { Name = "Member"}
                };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");

                if (user.Email == "admin@test.com") await userManager.AddToRoleAsync(user, "Admin");
            }

        }
    }
}
