using System.Threading.Tasks;
using Coolector.Services.Operations.Shared.Events;

namespace Collectively.Services.Websockets.Services
{
    public interface IOperationSignalRService
    {
        Task PublishOperationUpdatedAsync(OperationUpdated @event);
    }
}