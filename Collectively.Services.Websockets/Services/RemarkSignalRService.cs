using System.Linq;
using System.Threading.Tasks;
using Collectively.Services.Websockets.Hubs;
using Coolector.Common.Events;
using Coolector.Common.Extensions;
using Coolector.Services.Remarks.Shared.Events;
using Humanizer;

namespace Collectively.Services.Websockets.Services
{
    public class RemarkSignalRService : IRemarkSignalRService
    {
        private readonly CoolectorHub _hubContext;

        public RemarkSignalRService(CoolectorHub hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task PublishRemarkCreatedAsync(RemarkCreated @event)
        {
            var message = new
            {
                id = @event.RemarkId,
                author = @event.Username,
                category = @event.Category.Name,
                location = new
                {
                    address = @event.Location.Address,
                    coordinates = new[] { @event.Location.Longitude, @event.Location.Latitude },
                    type = "Point"
                },
                description = @event.Description,
                createdAt = @event.CreatedAt,
                resolved = false
            };
            await _hubContext.InvokeClientMethodToAllAsync(GetEventName(@event), message);
        }

        public async Task PublishRemarkResolvedAsync(RemarkResolved @event)
        {
            var message = new
            {
                remarkId = @event.RemarkId,
                resolverId = @event.UserId,
                resolver = @event.Username,
                resolvedAt = @event.ResolvedAt
            };
            await _hubContext.InvokeClientMethodToAllAsync(GetEventName(@event), message);
        }

        public async Task PublishRemarkDeletedAsync(RemarkDeleted @event)
        {
            var message = new
            {
                remarkId = @event.Id
            };
            await _hubContext.InvokeClientMethodToAllAsync(GetEventName(@event), message);
        }

        public async Task PublishPhotosToRemarkAddedAsync(PhotosToRemarkAdded @event)
        {
            var photosCount = @event.Photos.Select(x => x.GroupId).Distinct().Count();
            var newPhotos = @event.Photos
                .TakeLast(3)
                .Select(p => new
                {
                    groupId = p.GroupId,
                    name = p.Name,
                    size = p.Size,
                    url = p.Url,
                    metadata = p.Metadata
                })
                .ToList();
            var message = new
            {
                remarkId = @event.RemarkId,
                photosCount,
                newPhotos
            };
            await _hubContext.InvokeClientMethodToAllAsync(GetEventName(@event), message);
        }

        public async Task PublishPhotosFromRemarkRemovedAsync(PhotosFromRemarkRemoved @event)
        {
            var message = new
            {
                remarkId = @event.RemarkId,
                groupIds = @event.GroupIds,
                photos = @event.Photos
            };
            await _hubContext.InvokeClientMethodToAllAsync(GetEventName(@event), message);
        }

        public async Task PublishRemarkVoteSubmittedAsync(RemarkVoteSubmitted @event)
        {
            var message = new
            {
                remarkId = @event.RemarkId,
                userId = @event.UserId,
                positive = @event.Positive,
                createdAt = @event.CreatedAt
            };
            await _hubContext.InvokeClientMethodToAllAsync(GetEventName(@event), message);
        }

        public async Task PublishRemarkVoteDeletedAsync(RemarkVoteDeleted @event)
        {
            var message = new
            {
                remarkId = @event.RemarkId,
                userId = @event.UserId,
            };
            await _hubContext.InvokeClientMethodToAllAsync(GetEventName(@event), message);
        }

        private string GetEventName(IEvent @event) 
            => @event.GetType().Name.Humanize(LetterCasing.LowerCase).Underscore();
    }
}