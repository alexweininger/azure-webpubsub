using System.Collections.Specialized;
using System.Net;

using awps_link.Controllers;

using Azure.Messaging.WebPubSub.LocalLink;
using Azure.Messaging.WebPubSub.LocalLink.Controllers;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

internal class TunnelService
{
    private readonly TunnelServiceOptions _options;
    private readonly IRepository<HttpItem> _store;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<TunnelService> _logger;
    private readonly ILoggerFactory _loggerFactory;

    public TunnelService(IOptions<TunnelServiceOptions> options, IRepository<HttpItem> store, IHttpClientFactory httpClientFactory, ILoggerFactory loggerFactory)
    {
        _options = options.Value;
        _store = store;
        _httpClientFactory = httpClientFactory;
        _loggerFactory = loggerFactory;
        _logger = loggerFactory.CreateLogger<TunnelService>();
    }

    public async Task StartAsync()
    {
        Func<HttpRequestMessage, Task<HttpResponseMessage>> requestHandler = async (request) =>
        {
            using var httpClient = _httpClientFactory.CreateClient();
            var requestUrl = GetDisplayUrl(request);
            _logger.LogInformation($"Received request from: '{requestUrl}'");
            var targetUri = new UriBuilder("http", "localhost", _options.LocalPort).Uri;

            // Invoke local http server
            // Or self-host a server?
            var proxiedRequest = CreateProxyHttpRequest(request, targetUri);
            var proxiedRequestUrl = GetDisplayUrl(proxiedRequest);
            _logger.LogInformation($"Proxied request to '{proxiedRequestUrl}'");
            try
            {
                var response = await httpClient.SendAsync(proxiedRequest);
                _logger.LogInformation($"Received proxied response for '{proxiedRequestUrl}: {response.StatusCode}'");
                return response;
            }
            catch (Exception e)
            {
                _logger.LogError($"Error forwarding request '{proxiedRequestUrl}': {e.Message}");
                var response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                response.Content = new StringContent(e.Message);
                return response;
            }
        };

        var listener = new TunnelConnection(_store, _options.Endpoint, _options.Credential, _options.Hub, _loggerFactory);

        // Provide an HTTP request handler
        listener.RequestHandler = requestHandler;

        // Opening the listener establishes the control channel to
        // the Azure Relay service. The control channel is continuously 
        // maintained, and is reestablished when connectivity is disrupted.
        try
        {
            _logger.LogInformation("Connecting to " + _options.Endpoint);
            var connect = listener.ConnectAsync();
            _logger.LogInformation("Server listening");
            await connect;
        }
        catch (Exception e)
        {
            _logger.LogError("Error starting the listener: " + e.Message);
        }

        // Close the listener after you exit the processing loop.
        await listener.StopAsync();
    }

    public static HttpRequestMessage CreateProxyHttpRequest(HttpRequestMessage request, Uri uri)
    {
        if (request.RequestUri == null)
        {
            throw new ArgumentNullException(nameof(request.RequestUri));
        }

        var uriBuilder = new UriBuilder(request.RequestUri);
        // uri.Scheme, uri.Host, uri.Port, request.RequestUri.LocalPath, request.RequestUri.quer
        uriBuilder.Scheme = uri.Scheme;
        uriBuilder.Host = uri.Host;
        uriBuilder.Port = uri.Port;

        request.RequestUri = uriBuilder.Uri;

        return request;
    }

    private static string GetDisplayUrl(HttpRequestMessage request)
    {
        var uri = request.RequestUri?.OriginalString ?? string.Empty;
        var method = request.Method;
        var body = request.Content?.Headers.ContentLength;
        return $"{method} {uri} {body}";
    }
}