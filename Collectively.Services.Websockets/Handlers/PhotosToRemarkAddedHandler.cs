using System.Threading.Tasks;
using Collectively.Services.Websockets.Services;
using Coolector.Common.Events;
using Coolector.Common.Services;
using Coolector.Services.Remarks.Shared.Events;
using NLog;

namespace Collectively.Services.Websockets.Handlers
{
    public class PhotosToRemarkAddedHandler : IEventHandler<PhotosToRemarkAdded>
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IRemarkSignalRService _signalRService;
        private readonly IHandler _handler;

        public PhotosToRemarkAddedHandler(IHandler handler, IRemarkSignalRService signalRService)
        {
            _handler = handler;
            _signalRService = signalRService;
        }

        public async Task HandleAsync(PhotosToRemarkAdded @event)
        {
            Logger.Debug($"Handle {@event.GetType().Name} message");
            await _handler
                .Run(async () => await _signalRService.PublishPhotosToRemarkAddedAsync(@event))
                .OnError((ex, logger) =>
                {
                    logger.Error(ex, "Error during PublishPhotosToRemarkAddedAsync");
                })
                .ExecuteAsync();
        }
    }
}