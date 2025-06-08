using Domain.Contracts;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.AspNetCore.Hosting;
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
        private readonly IWebHostEnvironment _environment;

        public DbInitializer(AppDbContext context,
                             UserManager<AppUser> userManager,
                             RoleManager<IdentityRole<int>> roleManager,
                             IWebHostEnvironment environment)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _environment = environment;
        }
        public async Task InitializeAsync()
        {
            try
            {
                if (_context.Database.CanConnect())
                    await DropTablesAsync(_context);
                if ((await _context.Database.GetPendingMigrationsAsync()).Any())
                    await _context.Database.MigrateAsync();
                await InitializeIdentityAsync();

                if (!await _context.Specialties.AnyAsync())
                {
                    var specialtiesData = await File.ReadAllTextAsync(Path.Combine(_environment.WebRootPath, "Seeding", "specialties.json"));
                    var specialties = JsonSerializer.Deserialize<List<Specialty>>(specialtiesData);
                    if (specialties is not null && specialties.Any())
                    {
                        await _context.AddRangeAsync(specialties);
                        await _context.SaveChangesAsync();
                    }
                }

                if (!await _context.Doctors.AnyAsync())
                {
                    var DoctorsData = await File.ReadAllTextAsync(Path.Combine(_environment.WebRootPath, "Seeding", "doctors.json"));
                    var doctors = JsonSerializer.Deserialize<List<Doctor>>(DoctorsData);
                    if (doctors is not null && doctors.Any())
                    {
                        foreach (var doctor in doctors)
                        {
                            var appUser = new AppUser()
                            {
                                Email = doctor.Email,
                                UserName = $"{doctor.FirstName}DocNet{doctor.LastName}DocNet{doctor.Email}",
                                PhoneNumber = doctor.PhoneNumber,
                                EmailConfirmed = true,
                            };

                            var result = await _userManager.CreateAsync(appUser, "P@ssw0rd");
                            if (!result.Succeeded)
                            {
                                throw new ValidationException(result.Errors.Select(e => e.Description));
                            }

                            //doctor.AppUserID = (await _userManager.FindByEmailAsync(appUser.Email))?.Id;
                            doctor.AppUserID = appUser.Id;

                            var result1 = await _userManager.AddToRoleAsync(appUser, "doctor");
                            if (!result1.Succeeded)
                            {
                                throw new ValidationException(result.Errors.Select(e => e.Description));
                            }
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
                var rolesData = await File.ReadAllTextAsync(Path.Combine(_environment.WebRootPath, "Seeding", "roles.json"));
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
                    EmailConfirmed = true,
                };
                await _userManager.CreateAsync(admin, "P@ssw0rd");
                await _userManager.AddToRoleAsync(admin, "admin");

            }

        }

        private static async Task DropTablesAsync(AppDbContext context)
        {
            var dropConstraintsSql = @"
            DECLARE @DropConstraints NVARCHAR(MAX) = '';
            SELECT @DropConstraints += 
                'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' +
                QUOTENAME(OBJECT_NAME(parent_object_id)) + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';' + CHAR(13)
            FROM sys.foreign_keys;

            EXEC sp_executesql @DropConstraints;
            ";

            var dropSequencesSql = @"
            -- Drop all sequences
            DECLARE @DropSequences NVARCHAR(MAX) = '';
            SELECT @DropSequences += 
                'DROP SEQUENCE ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name) + ';' + CHAR(13)
            FROM sys.sequences;

            EXEC sp_executesql @DropSequences;
            ";

            var dropTablesSql = @"EXEC sp_msforeachtable 'DROP TABLE ?'";

            await context.Database.ExecuteSqlRawAsync(dropConstraintsSql);
            await context.Database.ExecuteSqlRawAsync(dropTablesSql);
            await context.Database.ExecuteSqlRawAsync(dropSequencesSql);
        }
    }
}
