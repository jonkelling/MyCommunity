﻿using System;
using System.Linq;
using System.Reflection;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyModel;
using Microsoft.Extensions.Logging;
using Server.Data;

namespace Server
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = config.Build();
        }

        public IContainer ApplicationContainer { get; private set; }

        public IConfigurationRoot Configuration { get; private set; }

        // ConfigureServices is where you register dependencies. This gets
        // called by the runtime before the Configure method, below.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            // Add services to the collection.
            services.AddMvc();
            services.AddApiVersioning();
            services.AddAutoMapper(config =>
            {
                config.AddProfile<UIMapperProfile>();
            });
            services.AddDbContext<MyCommunityContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("AzureSqlConnection")));

            services.AddScoped<IMapper>(sp =>
                new Mapper(sp.GetRequiredService<AutoMapper.IConfigurationProvider>(), sp.GetService));

            // Auth stuff (scopes)
            // var domain = $"https://{Configuration["Auth0:Domain"]}/";
            // var scopes = new[] {
            //     "read:users",
            //     "create:users",
            //     "update:users",
            //     "delete:users",
            // };
            // services.AddAuthorization(options =>
            // {
            //     foreach (var scope in scopes)
            //     {
            //         options.AddPolicy(scope, policy => policy.Requirements.Add(new HasScopeRequirement(scope, domain)));
            //     }
            // });

            // Create the container builder.
            var builder = new ContainerBuilder();

            // Register dependencies, populate the services from
            // the collection, and build the container. If you want
            // to dispose of the container at the end of the app,
            // be sure to keep a reference to it as a property or field.
            builder.RegisterType<MyCommunityContext>().AsImplementedInterfaces();

            builder.Populate(services);
            this.ApplicationContainer = builder.Build();

            // Create the IServiceProvider based on the container.
            return new AutofacServiceProvider(this.ApplicationContainer);
        }

        // Configure is where you add middleware. This is called after
        // ConfigureServices. You can use IApplicationBuilder.ApplicationServices
        // here if you need to resolve things from the container.
        public void Configure(
          IApplicationBuilder app,
          ILoggerFactory loggerFactory,
          IApplicationLifetime appLifetime)
        {
            loggerFactory.AddConsole(this.Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            var options = new JwtBearerOptions
            {
                Audience = Configuration["Auth0:ApiIdentifier"],
                Authority = $"https://{Configuration["Auth0:Domain"]}/"
            };
            app.UseJwtBearerAuthentication(options);

            app.UseMvc();

            RunEfMigrations(app);

            // If you want to dispose of resources that have been resolved in the
            // application container, register for the "ApplicationStopped" event.
            appLifetime.ApplicationStopped.Register(() => this.ApplicationContainer.Dispose());
        }

        private static void RunEfMigrations(IApplicationBuilder app)
        {
            try
            {
                using (var serviceScope = app.ApplicationServices
                    .GetRequiredService<IServiceScopeFactory>()
                    .CreateScope())
                {
                    serviceScope.ServiceProvider.GetService<MyCommunityContext>()
                        .Database.Migrate();
                }
            }
            catch (Exception e)
            {
                var msg = e.Message;
                var stacktrace = e.StackTrace;
            }
        }
    }
}
