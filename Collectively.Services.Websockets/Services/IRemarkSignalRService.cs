using System.Threading.Tasks;
using Coolector.Services.Remarks.Shared.Events;

namespace Collectively.Services.Websockets.Services
{
    public interface IRemarkSignalRService
    {
        Task PublishRemarkCreatedAsync(RemarkCreated @event);
        Task PublishRemarkResolvedAsync(RemarkResolved @event);
        Task PublishRemarkDeletedAsync(RemarkDeleted @event);
        Task PublishPhotosToRemarkAddedAsync(PhotosToRemarkAdded @event);
        Task PublishPhotosFromRemarkRemovedAsync(PhotosFromRemarkRemoved @event);
        Task PublishRemarkVoteSubmittedAsync(RemarkVoteSubmitted @event);
        Task PublishRemarkVoteDeletedAsync(RemarkVoteDeleted @event);
    }
}