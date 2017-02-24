using System.Threading.Tasks;
using Collectively.Services.Websockets.Services;
using Coolector.Common.Events;
using Coolector.Common.Services;
using Coolector.Services.Remarks.Shared.Events;
using NLog;

namespace Collectively.Services.Websockets.Handlers
{
    public class RemarkResolvedHandler : IEventHandler<RemarkResolved>
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IHandler _handler;
        private readonly IRemarkSignalRService _signalRService;

        public RemarkResolvedHandler(IHandler handler, IRemarkSignalRService signalRService)
        {
            _handler = handler;
            _signalRService = signalRService;
        }

        public async Task HandleAsync(RemarkResolved @event)
        {
            Logger.Debug($"Handle {@event.GetType().Name} message");
            await _handler
                .Run(async () => await _signalRService.PublishRemarkResolvedAsync(@event))
                .OnError((ex, logger) =>
                {
                    logger.Error(ex, "Error during PublishRemarkResolvedAsync");
                })
                .ExecuteAsync();
        }
    }
}