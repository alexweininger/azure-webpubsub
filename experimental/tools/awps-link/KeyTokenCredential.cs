using System.Text;

using Azure.Core;

namespace Azure.Messaging.WebPubSub.LocalLink
{
    public sealed class KeyTokenCredential : TokenCredential
    {
        private volatile KeyBytesCache _keyCache = new KeyBytesCache(string.Empty); // it's volatile so that the cache update below is not reordered
        private readonly string _accessKey;

        public KeyTokenCredential(string accessKey)
        {
            _accessKey = accessKey;
        }

        public override AccessToken GetToken(TokenRequestContext requestContext, CancellationToken cancellationToken)
        {
            var now = DateTimeOffset.UtcNow;
            var expiresAt = now + TimeSpan.FromMinutes(65);

            var key = _accessKey;
            var cache = _keyCache;
            if (!ReferenceEquals(key, cache.Key))
            {
                cache = new KeyBytesCache(key);
                _keyCache = cache;
            }

            var writer = new JwtBuilder(cache.KeyBytes);
            writer.AddClaim(JwtBuilder.Nbf, now);
            writer.AddClaim(JwtBuilder.Exp, expiresAt);
            writer.AddClaim(JwtBuilder.Iat, now);
            writer.AddClaim(JwtBuilder.Aud, requestContext.Claims);

            return new(writer.BuildString(), expiresAt);
            //int jwtLength = writer.End();

            //var prefix = "Bearer ";
            //var state = (prefix, writer);
            //var headerValue = NS2Bridge.CreateString(jwtLength + prefix.Length, state, (destination, state) => {
            //    var statePrefix = state.prefix;
            //    statePrefix.AsSpan().CopyTo(destination);
            //    state.writer.TryBuildTo(destination.Slice(statePrefix.Length), out _);
            //});

            //return new AccessToken(headerValue, expiresAt);
        }

        public override ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, CancellationToken cancellationToken)
        {
            return new(GetToken(requestContext, cancellationToken));
        }

        private sealed class KeyBytesCache
        {
            public KeyBytesCache(string key)
            {
                Key = key;
                KeyBytes = Encoding.UTF8.GetBytes(key);
            }
            public readonly byte[] KeyBytes;
            public readonly string Key;
        }
    }
}
