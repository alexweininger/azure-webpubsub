using Azure.Messaging.WebPubSub.LocalLink.Controllers;
using Azure.Messaging.WebPubSub.LocalLink.Hubs;

using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace awps_link.Controllers
{
    public class HttpItemRepository : IRepository<HttpItem>
    {
        private readonly StoreContext _store;
        private readonly IHubContext<DataHub> _hubContext;

        public HttpItemRepository(StoreContext store, IHubContext<DataHub> hubContext)
        {
            _store = store;
            _store.Database.EnsureCreated();
            _hubContext = hubContext;
        }
        public Task<List<HttpItem>> GetRangeAsync(int count, CancellationToken cancellationToken)
        {
            return _store.HttpItems.OrderByDescending(s => s.RequestAt).Take(count).ToListAsync(cancellationToken);
        }

        public Task AddAsync(HttpItem item, CancellationToken cancellationToken)
        {
            var hubTask = _hubContext.Clients.All.SendAsync("updateData", item, cancellationToken);
            _store.HttpItems.Add(item);
            var dbTask = _store.SaveChangesAsync();
            return Task.WhenAll(hubTask, dbTask);
        }

        public Task<List<HttpItem>> GetAllAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(HttpItem entity, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task RemoveAsync(HttpItem entity, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<HttpItem> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}