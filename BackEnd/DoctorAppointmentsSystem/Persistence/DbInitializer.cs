using Domain.Contracts;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Persistence
{
    public class DbInitializer : IDbInitializer
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;
        public DbInitializer(AppDbContext context,
               UserManager<AppUser> userManager
            , RoleManager<IdentityRole<int>> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;

        }
        public async Task InitializeAsync()
        {

            try
            {
                if ((await _context.Database.GetPendingMigrationsAsync()).Any())
                    await _context.Database.MigrateAsync();
                await InitializeIdentityAsync();

                if (!(await _context.Specialties.AnyAsync()))
                {
                    var specialtiesData = await File.ReadAllTextAsync(@"..\Infrastructure\Persistence\Data\Seeding\specialties.json");
                    var specialties = JsonSerializer.Deserialize<List<Specialty>>(specialtiesData);
                    if (specialties is not null && specialties.Any())
                    {
                        await _context.AddRangeAsync(specialties);
                        await _context.SaveChangesAsync();
                    }
                }



                if (!(await _context.Doctors.AnyAsync()))
                {
                    var DoctorsData = await File.ReadAllTextAsync(@"..\Infrastructure\Persistence\Data\Seeding\doctors.json");
                    var doctors = JsonSerializer.Deserialize<List<Doctor>>(DoctorsData);
                    if (doctors is not null && doctors.Any())
                    {
                        await _context.AddRangeAsync(doctors);
                        await _context.SaveChangesAsync();
                    }

                }

                if (!(await _context.Doctors.AnyAsync()))
                {
                    var DoctorsData = await File.ReadAllTextAsync(@"..\Infrastructure\Persistence\Data\Seeding\doctors.json");
                    var doctors = JsonSerializer.Deserialize<List<Doctor>>(DoctorsData);
                    if (doctors is not null && doctors.Any())
                    {
                        foreach (var doctor in doctors)
                        {
                            var appUser = new AppUser()
                            {
                                Email = doctor.Email,
                                UserName = $"{doctor.FirstName},{doctor.LastName},{doctor.Email}",
                                PhoneNumber = doctor.PhoneNumber
                            };
                            var result = await _userManager.CreateAsync(appUser, "P@ssw0rd");
                            doctor.AppUserID = appUser.Id;
                            await _userManager.AddToRoleAsync(appUser, "doctor");
                        }

                        await _context.AddRangeAsync(doctors);
                        await _context.SaveChangesAsync();
                    }


                }


            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.ToString());
            }


        }
        public async Task InitializeIdentityAsync()
        {
            if (!_roleManager.Roles.Any())
            {
                var rolesData = await File.ReadAllTextAsync(@"..\Infrastructure\Persistence\Data\Seeding\roles.json");
                var roles = JsonSerializer.Deserialize<List<string>>(rolesData);

                if (roles is not null && roles.Any())
                {
                    foreach (var role in roles)
                    {
                        if (!await _roleManager.RoleExistsAsync(role))
                        {
                            await _roleManager.CreateAsync(new IdentityRole<int>(role));
                        }
                    }
                }

            }
            // add admins  
            if (!_userManager.Users.Any())
            {
                var admin = new AppUser()
                {
                    Email = "admin@gmail.com",
                    UserName = "DocNetAdmin",
                    PhoneNumber = "1234567890",
                };
                await _userManager.CreateAsync(admin, "P@ssw0rd");
                await _userManager.AddToRoleAsync(admin, "admin");

            }

        }
    }
}
