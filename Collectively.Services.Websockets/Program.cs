using Coolector.Common.Host;
using Coolector.Services.Operations.Shared.Events;
using Coolector.Services.Remarks.Shared.Events;

namespace Collectively.Services.Websockets
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WebServiceHost.Create<Startup>(port:15000)
                .UseAutofac(Startup.LifeTimeScope)
                .UseRabbitMq(queueName: typeof(Program).Namespace)
                .SubscribeToEvent<RemarkCreated>()
                .SubscribeToEvent<RemarkResolved>()
                .SubscribeToEvent<RemarkDeleted>()
                .SubscribeToEvent<PhotosToRemarkAdded>()
                .SubscribeToEvent<PhotosFromRemarkRemoved>()
                .SubscribeToEvent<RemarkVoteSubmitted>()
                .SubscribeToEvent<RemarkVoteDeleted>()
                .SubscribeToEvent<OperationUpdated>()
                .Build()
                .Run();
        }
    }
}
