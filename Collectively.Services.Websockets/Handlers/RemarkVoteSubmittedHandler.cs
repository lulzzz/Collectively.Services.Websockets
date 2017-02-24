using System.Threading.Tasks;
using Collectively.Services.Websockets.Services;
using Coolector.Common.Events;
using Coolector.Common.Services;
using Coolector.Services.Remarks.Shared.Events;
using NLog;

namespace Collectively.Services.Websockets.Handlers
{
    public class RemarkVoteSubmittedHandler : IEventHandler<RemarkVoteSubmitted>
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IHandler _handler;
        private readonly IRemarkSignalRService _signalRService;

        public RemarkVoteSubmittedHandler(IHandler handler,
            IRemarkSignalRService signalRService)
        {
            _handler = handler;
            _signalRService = signalRService;
        }

        public async Task HandleAsync(RemarkVoteSubmitted @event)
        {
            Logger.Debug($"Handle {@event.GetType().Name} message");
            await _handler
                .Run(async () => await _signalRService.PublishRemarkVoteSubmittedAsync(@event))
                .OnError((ex, logger) => logger.Error(ex, 
                    $"Error while handling {@event.GetType().Name} event"))
                .ExecuteAsync();
        }
    }
}