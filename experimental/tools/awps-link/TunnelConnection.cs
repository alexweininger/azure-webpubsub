using System.Buffers;
using System.Net;
using System.Net.WebSockets;
using System.Runtime.InteropServices;
using System.Threading;

using awps_link.Controllers;

using Azure.Core;
using Azure.Messaging.WebPubSub.LocalLink.Controllers;

using Microsoft.AspNetCore.Http;
using Microsoft.Azure.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Net.Http.Headers;

using Newtonsoft.Json.Linq;

using static Microsoft.Azure.SignalR.TunnelMessageProtocol;

namespace Azure.Messaging.WebPubSub.LocalLink
{
    public sealed class TunnelConnection : IDisposable
    {
        private const string HttpTunnelPath = "server/tunnel";
        private readonly CancellationTokenSource _cts = new CancellationTokenSource();
        private readonly TaskCompletionSource<WebSocketCloseStatus?> _closeTcs = new(TaskCreationOptions.RunContinuationsAsynchronously);
        private volatile WebSocketConnection _webSocket;

        private readonly ILogger _logger;
        private readonly string _hub;
        private readonly ILoggerFactory _loggerFactory;

        private TokenCredential _credential;

        // Can change with every reconnect
        private string? _target;
        private Uri? _tunnelEndpoint;
        private readonly IRepository<HttpItem> _store;
        private Uri _endpoint;

        string? Target
        {
            get => _target;
            set
            {
                if (value != _target)
                {
                    _target = value;
                    _tunnelEndpoint = GetTunnelEndpoint();
                }
            }
        }

        Uri TunnelEndpoint
        {
            get
            {
                if (_tunnelEndpoint == null)
                {
                    _tunnelEndpoint = GetTunnelEndpoint();
                }

                return _tunnelEndpoint;
            }
        }

        Uri Endpoint
        {
            get => _endpoint;
            set
            {
                if (value != _endpoint)
                {
                    _endpoint = value;
                    _tunnelEndpoint = GetTunnelEndpoint();
                }
            }
        }

        public Task<WebSocketCloseStatus?> CloseTask => _closeTcs.Task;

        public TunnelConnection(IRepository<HttpItem> store, Uri endpoint, TokenCredential credential, string hub, ILoggerFactory loggerFactory)
        {
            _store = store;
            _endpoint = endpoint;
            _credential = credential;
            _hub = hub;
            _loggerFactory = loggerFactory;
            _logger = _loggerFactory.CreateLogger<TunnelConnection>();
        }

        public void Dispose()
        {
            _webSocket.Dispose();
        }

        public Task StopAsync()
        {
            return _webSocket.StopAsync();
        }

        public Func<HttpRequestMessage, Task<HttpResponseMessage>> RequestHandler { get; set; }

        private async Task ConnectCore()
        {
            var bearer = await _credential.GetTokenAsync(new TokenRequestContext(new string[] { "https://webpubsub.azure.com" }, claims: TunnelEndpoint.AbsoluteUri), _cts.Token);
            var ws = _webSocket = new WebSocketConnection(TunnelEndpoint, bearer.Token, _logger, _cts.Token);
            ws.OnMessage = m => ProcessTunnelMessageAsync(m, _cts.Token);
            ws.OnConnected = () => { _logger.LogInformation("Connected to " + TunnelEndpoint.AbsoluteUri); return Task.CompletedTask; };
            ws.OnConnected = () => { _logger.LogInformation("Disconnected to " + TunnelEndpoint.AbsoluteUri); return Task.CompletedTask; };
            await ws.LifecycleTask;
        }

        public async Task ConnectAsync()
        {
            _logger.LogInformation($"Connecting to {TunnelEndpoint.AbsoluteUri}");
            try
            {
                await Utilities.WithRetry(ConnectCore, _logger);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error connecting to {TunnelEndpoint.AbsoluteUri}: {e.Message}");
            }
        }

        private Uri GetTunnelEndpoint()
        {
            var uriBuilder = new UriBuilder(_endpoint.AbsoluteUri);
            uriBuilder.Scheme = uriBuilder.Scheme.Equals("http", StringComparison.OrdinalIgnoreCase) ? "ws" : "wss";
            uriBuilder.Path = uriBuilder.Path + HttpTunnelPath;
            var hubQuery = $"hub={WebUtility.UrlEncode(_hub)}";
            if (string.IsNullOrEmpty(uriBuilder.Query))
            {
                uriBuilder.Query = hubQuery;
            }
            else
            {
                uriBuilder.Query = $"{uriBuilder.Query}&{hubQuery}";
            }
            var target = _target;
            if (string.IsNullOrEmpty(target))
            {
                return uriBuilder.Uri;
            }

            uriBuilder.Query = $"{uriBuilder.Query}&{WebUtility.UrlEncode(target)}";
            return uriBuilder.Uri;
        }

        private async Task ProcessTunnelMessageAsync(TunnelMessage message, CancellationToken token)
        {
            switch (message!)
            {
                case TunnelRequestMessage request:
                    {
                        _logger.LogInformation($"Getting request {request.TracingId}: {request.HttpMethod} {request.Url}");
                        var arrivedAt = DateTime.UtcNow;
                        // invoke remote
                        HttpResponseMessage response;
                        response = await RequestHandler.Invoke(ToHttp(request));
                        var processedAt = DateTime.UtcNow;

                        using var writer = new MemoryBufferWriter();

                        // TODO: write directly to memory instead of convert
                        var result = await ToResponse(request, response);
                        _logger.LogInformation($"Getting response for {request.TracingId}: {response.StatusCode}");
                        
                        _ = _store.AddAsync(new HttpItem
                        {
                            Code = (int)response.StatusCode,
                            TracingId = request.TracingId,
                            MethodName = request.HttpMethod,
                            RequestAt = arrivedAt,
                            RequestRaw = request.DumpRaw(),
                            Url = request.Url,
                            RespondAt = processedAt,
                            ResponseRaw = result.DumpRaw(),
                        }, token);

                        Instance.Write(result, writer);
                        using var owner = writer.CreateMemoryOwner();
                        await _webSocket.SendAsync(owner.Memory, token);
                    }
                    break;
                case ServiceReconnectTunnelMessage reconnect:
                    {
                        _logger.LogInformation($"Reconnect the connection: {reconnect.Message}.");
                        _ = Reconnect(reconnect);
                    }
                    break;
                case ConnectionCloseTunnelMessage close:
                    {
                        _logger.LogInformation($"Close the connection: {close.Message}.");
                        _ = StopAsync();
                    }
                    break;
                case ServiceStatusTunnelMessage status:
                    {
                        _logger.LogInformation(status.Message);
                    }
                    break;
                default:
                    throw new NotSupportedException(message.Type.ToString());
            }
        }

        private async Task Reconnect(ServiceReconnectTunnelMessage reconnect)
        {
            await StopAsync();
            Target = reconnect.TargetId;
            Endpoint = new Uri(reconnect.Endpoint);
            await ConnectAsync();
        }

        private static HttpRequestMessage ToHttp(TunnelRequestMessage request)
        {
            var http = new HttpRequestMessage()
            {
                RequestUri = new Uri(request.Url),
                Method = new HttpMethod(request.HttpMethod),
            };
            if (request.Content.Length > 0)
            {
                var streamContent = new StreamContent(new MemoryStream(request.Content.ToArray()));
                http.Content = streamContent;
            }

            // Copy the request headers
            foreach (var (header, value) in request.Headers)
            {
                if (!http.Headers.TryAddWithoutValidation(header, value) && http.Content != null)
                {
                    http.Content?.Headers.TryAddWithoutValidation(header, value);
                }
            }
            return http;
        }

        private async Task<TunnelResponseMessage> ToResponse(TunnelRequestMessage request, HttpResponseMessage message)
        {
            var bytes = new TunnelResponseMessage(request.AckId, request.GlobalRouting, (int)message.StatusCode, request.ChannelName, null)
            {
                Content = await message.Content.ReadAsByteArrayAsync(),
            };

            foreach (var (key, header) in message.Headers)
            {
                //if (string.Equals("Connection", key, StringComparison.OrdinalIgnoreCase)) continue;
                //if (string.Equals("Keep-Alive", key, StringComparison.OrdinalIgnoreCase)) continue;
                bytes.Headers.Add(key, header.ToArray());
            }

            if (message.Content != null)
            {
                foreach (var (key, header) in message.Content.Headers)
                {
                    bytes.Headers.Add(key, header.ToArray());
                }
            }
            return bytes;
        }

        private sealed class WebSocketConnection: IDisposable
        {
            private readonly CancellationTokenSource _cts = new CancellationTokenSource();
            private readonly Uri _endpoint;
            private readonly ILogger _logger;
            private readonly ClientWebSocket _webSocket;
            private Task _receiving;

            public Task LifecycleTask { get; }

            public WebSocketConnection(Uri endpoint, string token, ILogger logger, CancellationToken cancellation)
            {
                _endpoint = endpoint;
                _logger = logger;
                _webSocket = new ClientWebSocket();
                _webSocket.Options.SetRequestHeader(HeaderNames.Authorization, "Bearer " + token);

                // start the life cycle
                LifecycleTask = RunAsync(cancellation);
            }

            public ValueTask SendAsync(ReadOnlyMemory<byte> buffer, CancellationToken cancellationToken)
            {
                return _webSocket.SendAsync(buffer, WebSocketMessageType.Binary, true, cancellationToken);
            }

            public async Task StopAsync()
            {
                _cts.Cancel();
                try
                {
                    // Block a Start from happening until we've finished capturing the connection state.
                    await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", default);
                }
                catch { }

                try
                {
                    await LifecycleTask.ConfigureAwait(false);
                }
                catch { }
            }

            public Func<Task> OnConnected { get; set; }

            public Func<DisconnectEvent, Exception, Task> OnDisconnected { get; set; }

            public Func<TunnelMessage, Task> OnMessage { get; set; }

            private async Task RunAsync(CancellationToken cancellation)
            {
                await _webSocket.ConnectAsync(_endpoint, cancellation).ConfigureAwait(false);
                await (OnConnected?.Invoke() ?? Task.CompletedTask).ConfigureAwait(false);
                await ReceiveLoop(cancellation).ConfigureAwait(false);
            }

            private async Task ReceiveLoop(CancellationToken token)
            {
                var linked = CancellationTokenSource.CreateLinkedTokenSource(token, _cts.Token).Token;
                using var buffer = new MemoryBufferWriter();
                while (!linked.IsCancellationRequested)
                {
                    buffer.Reset();
                    while (!linked.IsCancellationRequested)
                    {
                        var memory = buffer.GetMemory();
                        ValueWebSocketReceiveResult receiveResult;
                        try
                        {
                            receiveResult = await _webSocket.ReceiveAsync(memory, linked);
                        }
                        catch (Exception ex) when (ex is InvalidOperationException || ex is ObjectDisposedException)
                        {
                            // _webSocket ends remotely
                            OnDisconnected?.Invoke(DisconnectEvent.ClosedWithException, ex);
                            return;
                        }
                        catch (Exception ex)
                        {
                            OnDisconnected?.Invoke(DisconnectEvent.ClosedWithException, ex);
                            _logger.LogError("Error receiving", ex);
                            throw;
                        }

                        // Need to check again for NetCoreApp2.2 because a close can happen between a 0-byte read and the actual read
                        if (receiveResult.MessageType == WebSocketMessageType.Close)
                        {
                            try
                            {
                                await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, default);
                            }
                            catch
                            {
                                // It is possible that the remote is already closed
                            }

                            OnDisconnected?.Invoke(DisconnectEvent.CloseFrameReceived, null);
                            return;
                        }

                        // always binary
                        if (receiveResult.MessageType != WebSocketMessageType.Binary)
                        {
                            OnDisconnected?.Invoke(DisconnectEvent.ClosedWithInvalidMessageType, null);
                            throw new InvalidDataException("Only support binary");
                        }

                        var current = new ReadOnlySequence<byte>(memory[..receiveResult.Count]);

                        if (OnMessage != null)
                        {
                            while (Instance.TryParse(ref current, out var message))
                            {
                                await OnMessage.Invoke(message);
                            }

                            // advance to current parsed
                            buffer.Advance(receiveResult.Count - (int)current.Length);
                        }
                    }
                }
            }

            public void Dispose()
            {
                _cts.Cancel();
                _cts.Dispose();
                _webSocket.Dispose();
            }

            public enum DisconnectEvent
            {
                CloseFrameReceived,
                ClosedWithException,
                ClosedWithInvalidMessageType
            }
        }
    }
}
