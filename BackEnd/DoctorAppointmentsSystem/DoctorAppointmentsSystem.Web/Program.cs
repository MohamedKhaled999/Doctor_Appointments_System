using DoctorAppointmentsSystem.Web.Factories;
using DoctorAppointmentsSystem.Web.Middlewares;
using Domain.Contracts;
using Domain.Models;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using Persistence.Repositories;
using Services;
using Services.Abstraction;
using Services.Notifications;
using Shared.Authentication;
using System.Text;

namespace DoctorAppointmentsSystem.Web
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(op => op.AddPolicy("allow",
                op => op.WithOrigins(builder.Configuration["FrontEnd:Url"]).AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

            builder.Services.AddSignalR();

            //For Validation
            builder.Services.Configure<ApiBehaviorOptions>(op =>
            {
                op.InvalidModelStateResponseFactory = ApiResponseFactory.CustomValidationErrors;
            });


            #region Identity
            builder.Services.AddIdentity<AppUser, IdentityRole<int>>(op =>
            {
                op.Password.RequireLowercase = false;
                op.Password.RequireNonAlphanumeric = false;
                op.Password.RequireLowercase = false;
                op.Password.RequireDigit = false;
                op.Password.RequiredLength = 8;
            }).AddDefaultTokenProviders()
            .AddEntityFrameworkStores<AppDbContext>();
            #endregion

            #region DbContext & DbInitializer
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            builder.Services.AddScoped<IDbInitializer, DbInitializer>();
            #endregion

            #region IUnitOfWork
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped(typeof(IGenericRepository<,>), typeof(GenericRepository<,>));
            #endregion

            #region AutoMapper
            builder.Services.AddAutoMapper(typeof(Services.AssemblyReference).Assembly);
            #endregion

            #region Persentation
            builder.Services.AddControllers().AddApplicationPart(typeof(Persistence.AssemblyReference).Assembly);
            #endregion

            #region Authentication
            builder.Services.Configure<JWTOptions>(builder.Configuration.GetSection("JwtOptions"));


            builder.Services.AddAuthentication(
                op =>
                {
                    op.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    op.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                }
                ).AddJwtBearer(op =>
                {
                    var jwtOptions = builder.Configuration.GetSection("JwtOptions").Get<JWTOptions>();
                    op.TokenValidationParameters = new()
                    {
                        ValidateIssuer = true,
                        // ValidateAudience = true, // Uncomment this line if you want to validate the audience
                        ValidateAudience = false, // for development 
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtOptions.Issuer,
                        ValidAudience = jwtOptions.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),
                    };
                    op.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                path.StartsWithSegments("/hub"))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });
            #endregion

            #region Logging
            builder.Services.AddSingleton(typeof(ILogger), sp =>
            {
                var environment = sp.GetRequiredService<IWebHostEnvironment>();
                return new Middlewares.Logger(LogLevel.Information, environment);
            });
            #endregion

            #region Scheduling Jobs
            builder.Services.AddHangfire(x => x.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddHangfireServer();
            #endregion

            builder.Services.AddScoped<IServiceManager, ServiceManager>();

            var app = builder.Build();

            await InitializeDbAsync(app);

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseMiddleware<ExceptionHandlingMiddleware>();

            app.UseHttpsRedirection();

            app.UseCors("allow");

            app.MapStaticAssets();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapHub<NotificationHub>("/hub");

            app.MapControllers();

            app.Run();

        }
        private static async Task InitializeDbAsync(WebApplication app)
        {
            var scope = app.Services.CreateScope();
            var dbInitializer = scope.ServiceProvider.GetRequiredService<IDbInitializer>();
            await dbInitializer.InitializeAsync();
        }
    }
}
