using System.Threading.Tasks;
using Collectively.Services.Websockets.Services;
using Coolector.Common.Events;
using Coolector.Common.Services;
using Coolector.Services.Operations.Shared.Events;
using NLog;

namespace Collectively.Services.Websockets.Handlers
{
    public class OperationUpdatedHandler : IEventHandler<OperationUpdated>
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IHandler _handler;
        private readonly IOperationSignalRService _signalRService;

        public OperationUpdatedHandler(IHandler handler, IOperationSignalRService signalRService)
        {
            _handler = handler;
            _signalRService = signalRService;
        }

        public async Task HandleAsync(OperationUpdated @event)
        {
            Logger.Debug($"Handle {@event.GetType().Name} message");
            await _handler
                .Run(async () => await _signalRService.PublishOperationUpdatedAsync(@event))
                .OnError((ex, logger) =>
                {
                    logger.Error(ex, "Error during PublishOperationUpdatedAsync");
                })
                .ExecuteAsync();
        }
    }
}