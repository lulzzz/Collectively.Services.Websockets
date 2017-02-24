using System.Threading.Tasks;
using Collectively.Services.Websockets.Hubs;
using Coolector.Services.Operations.Shared.Events;

namespace Collectively.Services.Websockets.Services
{
    public class OperationSignalRService : IOperationSignalRService
    {
        private readonly CoolectorHub _hubContext;

        public OperationSignalRService(CoolectorHub hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task PublishOperationUpdatedAsync(OperationUpdated @event)
        {
            var message = new
            {
                requestId = @event.RequestId.ToString(),
                name = @event.Name,
                userId = @event.UserId,
                state = @event.State,
                code = @event.Code,
                message = @event.Message,
                updatedAt = @event.UpdatedAt
            };

            await _hubContext.InvokeClientGroupMethodAsync(@event.UserId, "operation_updated", message);
        }
    }
}