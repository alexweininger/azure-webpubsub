using Microsoft.AspNetCore.SignalR;

namespace Azure.Messaging.WebPubSub.LocalLink.Hubs
{
    public class DataHub : Hub
    {
        public DataHub()
        {
        }

        public override Task OnConnectedAsync()
        {
            var i = Context.ConnectionId;
            return base.OnConnectedAsync();
        }
    }
}
