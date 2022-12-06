using System;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

using awps_link.Controllers;

using Azure.Identity;
using Azure.Messaging.WebPubSub;
using Azure.Messaging.WebPubSub.LocalLink;
using Azure.Messaging.WebPubSub.LocalLink.Controllers;
using Azure.Messaging.WebPubSub.LocalLink.Hubs;

using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public partial class App
{
    public static CommandLineApplication CreateApp()
    {
        var commandApp = new CommandLineApplication();

        commandApp.Name = "awps-linker";
        commandApp.Description = "Link local to Azure Web PubSub to help localhost accessible by Azure Web PubSub service";
        commandApp.HelpOption("-h|--help");
        // local-host link --url webpubsub1.webpubsub.azure.com
        // local-host status (show linked resources)
        // local-host start -p 8080
        var portOptions = commandApp.Option("-p|--port", "Specify the port of localhost server", CommandOptionType.SingleValue);
        var hubOption = commandApp.Option("--hub", "Specify the hub to connect to", CommandOptionType.SingleValue);
        var connectionStringOption = commandApp.Option("--cs", "Specify the connection string to the service", CommandOptionType.SingleValue);
        var schemeOption = commandApp.Option("--scheme", "Specify the scheme used to invoke the upstream, supported options are http and https, default is http", CommandOptionType.SingleValue);

        var userDataFolder = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        var appDataFile = Path.Combine(userDataFolder, commandApp.Name, "settings.json");
        var storageFile = Path.Combine(userDataFolder, commandApp.Name, "data.sqlite");
        var dirFile = Path.GetDirectoryName(appDataFile);
        Directory.CreateDirectory(dirFile!);

        AppData? appData = null;
        if (File.Exists(appDataFile))
        {
            try
            {
                var stored = JsonSerializer.Deserialize<AppData>(File.OpenRead(appDataFile));
            }
            catch { }
        }

        commandApp.Command("status", command =>
        {
            command.Description = "Show the current status.";
            command.HelpOption("-h|--help");
            command.OnExecute(() =>
            {
                if (appData?.ServiceUri == null)
                {
                    command.Error.WriteLine("Not yet linked to Web PubSub service. Use 'link --url <your service url>' to link the url.");
                    return 1;
                }
                else
                {
                    command.Out.WriteLine($"Linked to Web PubSub service ${appData.ServiceUri}");
                }
                return 0;
            });
        });
        commandApp.Command("link", command =>
        {
            command.Description = "Link the local tool with the remote Web PubSub service";
            command.HelpOption("-h|--help");
            var urlOption = command.Option("-u|--url", "The url of the service", CommandOptionType.SingleValue); // could link to multiple services
            command.OnExecute(() =>
            {
                var url = urlOption.Value();
                if (string.IsNullOrEmpty(url))
                {
                    command.Error.WriteLine("Url should not be empty.");
                    return 1;
                }

                // store to local file config
                appData.ServiceUri = url;
                JsonSerializer.Serialize<AppData>(File.OpenWrite(appDataFile), appData, new JsonSerializerOptions { WriteIndented = true });
                command.Out.WriteLine($"Settins stored to {appDataFile}");
                return 0;
            });
        });

        commandApp.OnExecute(async () =>
        {
            if (!hubOption.HasValue())
            {
                commandApp.ShowHelp();
                return 1;
            }
            var hub = hubOption.Value();
            var port = 8080;
            SupportedScheme scheme = SupportedScheme.Http;
            _ = int.TryParse(portOptions.Value(), out port);
            _ = Enum.TryParse<SupportedScheme>(schemeOption.Value(), out scheme);
            Connection connection;
            if (connectionStringOption.HasValue())
            {
                connection = ParsedConnectionString(connectionStringOption.Value());
            }
            else
            {
                if (appData?.ServiceUri == null)
                {
                    commandApp.Out.WriteLine("Service endpoint is not specified. Please ....");
                    return 1;
                }

                connection = new Connection(new Uri(appData.ServiceUri), new DefaultAzureCredential(true));
            }
            using var store = new StoreContext(storageFile);
            var appBuilder = WebApplication.CreateBuilder();

            // Add services to the container.

            appBuilder.Services.AddControllersWithViews();
            appBuilder.Services.AddSignalR();

            var services = appBuilder.Services;

            services.AddHttpClient();
            services.AddSingleton<TunnelService>();
            services.Configure<TunnelServiceOptions>(o =>
            {
                o.Endpoint = connection.Endpoint;
                o.Credential = connection.Credential;
                o.Hub = hub;
                o.LocalScheme = scheme.ToString().ToLower();
                o.LocalPort = port;
            });
            services.AddSingleton<StoreContext>(store);
            services.AddSingleton<IRepository<HttpItem>, HttpItemRepository>();

            var app = appBuilder.Build();
            WebPubSubServiceClient client;
            if (connection.Key != null)
            {
                client = new WebPubSubServiceClient(connection.Endpoint, hub, new Azure.AzureKeyCredential(connection.Key));
            }
            else
            {
                client = new WebPubSubServiceClient(connection.Endpoint, hub, connection.Credential);
            }
            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
            }

            app.UseStaticFiles();
            app.UseRouting();

            app.MapHub<DataHub>("/datahub");
            app.MapGet("webpubsuburl", async () =>
            {
                var url = await client.GetClientAccessUriAsync();
                return new
                {
                    url = url,
                    endpoint = connection.Endpoint,
                    hub = hub,
                };
            });
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");
            app.MapFallbackToFile("index.html");

            var tunnelService = app.Services.GetRequiredService<TunnelService>();

            await app.StartAsync();
            await tunnelService.StartAsync();
            return 0;
        });

        return commandApp;
    }

    private static Connection ParsedConnectionString(string conn)
    {
        var dict = conn.Split(";").Select(s => s.Split("=")).Where(i => i.Length == 2).ToDictionary(j => j[0], j => j[1], StringComparer.OrdinalIgnoreCase);
        if (dict.TryGetValue("version", out var version) && version != "1.0")
        {
            throw new NotSupportedException($"Version {version} is not supported.");
        }
        if (!dict.TryGetValue("endpoint", out var ep) || !Uri.TryCreate(ep, UriKind.Absolute, out var endpoint))
        {
            throw new ArgumentException($"Bad connection string endpoint {ep}");
        }
        if (dict.TryGetValue("port", out var port) && int.TryParse(port, out var portVal))
        {
            var uriBuilder = new UriBuilder(endpoint);
            uriBuilder.Port = portVal;
            endpoint = uriBuilder.Uri;
        }

        if (dict.TryGetValue("AccessKey", out var key))
        {
            return new(endpoint, new KeyTokenCredential(key), key);
        }
        else
        {
            return new(endpoint, new DefaultAzureCredential(true));
        }
    }

    enum SupportedScheme
    {
        Http,
        Https
    }
}
