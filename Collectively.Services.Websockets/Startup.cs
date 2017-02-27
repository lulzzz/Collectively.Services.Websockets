using System;
using System.Reflection;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Collectively.Services.Websockets.Hubs;
using Collectively.Services.Websockets.Manager;
using Collectively.Services.Websockets.Services;
using Coolector.Common.Commands;
using Coolector.Common.Events;
using Coolector.Common.Exceptionless;
using Coolector.Common.Extensions;
using Coolector.Common.RabbitMq;
using Coolector.Common.Security;
using Coolector.Common.Services;
using Lockbox.Client.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog.Extensions.Logging;
using NLog.Web;
using RawRabbit.Configuration;

namespace Collectively.Services.Websockets
{
    public class Startup
    {
        public string EnvironmentName { get; }
        public IConfiguration Configuration { get; }
        public static ILifetimeScope LifeTimeScope { get; private set; }

        public Startup(IHostingEnvironment env)
        {
            EnvironmentName = env.EnvironmentName.ToLowerInvariant();
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables()
                .SetBasePath(env.ContentRootPath);

            if (env.IsProduction() || env.IsDevelopment())
            {
                builder.AddLockbox();
            }

            Configuration = builder.Build();
        }

        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddWebSocketManager();

            var assembly = Assembly.GetEntryAssembly();
            var builder = new ContainerBuilder();
            builder.Populate(services);

            SecurityContainer.Register(builder, Configuration);
            RabbitMqContainer.Register(builder, Configuration.GetSettings<RawRabbitConfiguration>());
            builder.Populate(services);
            builder.RegisterAssemblyTypes(assembly).AsClosedTypesOf(typeof(IEventHandler<>));
            builder.RegisterAssemblyTypes(assembly).AsClosedTypesOf(typeof(ICommandHandler<>));

            builder.RegisterInstance(Configuration.GetSettings<ExceptionlessSettings>()).SingleInstance();
            builder.RegisterType<ExceptionlessExceptionHandler>().As<IExceptionHandler>().SingleInstance();
            builder.RegisterType<Handler>().As<IHandler>();
            builder.RegisterType<RemarkSignalRService>().As<IRemarkSignalRService>();
            builder.RegisterType<OperationSignalRService>().As<IOperationSignalRService>();
            builder.RegisterType<GroupManager>().As<IGroupManager>();

            LifeTimeScope = builder.Build().BeginLifetimeScope();

            return new AutofacServiceProvider(LifeTimeScope);
        }


        public void Configure(IApplicationBuilder app, IServiceProvider serviceProvider,
            IHostingEnvironment env, ILoggerFactory loggerFactory, 
            IApplicationLifetime appLifetime)
        {
            loggerFactory.AddNLog();
            app.AddNLogWeb();
            env.ConfigureNLog("nlog.config");

            app.UseStaticFiles();
            app.UseWebSockets();
            app.MapWebSocketManager("/hub", serviceProvider.GetService<CoolectorHub>());

            appLifetime.ApplicationStopped.Register(() => LifeTimeScope.Dispose());
        }
    }
}