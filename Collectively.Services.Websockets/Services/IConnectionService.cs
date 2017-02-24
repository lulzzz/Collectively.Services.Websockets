using System.Collections.Concurrent;
using System.Collections.Generic;

namespace Collectively.Services.Websockets.Services
{
    public interface IConnectionService
    {
        void Connected(string connectionId, string userId);
        void Disconnected(string connectionId);
    }

    public class ConnectionService : IConnectionService
    {
        private readonly ConcurrentDictionary<string, HashSet<string>> _userConnections;

        public ConnectionService()
        {
            _userConnections = new ConcurrentDictionary<string, HashSet<string>>();
        }

        public void Connected(string connectionId, string userId)
        {
            _userConnections.AddOrUpdate(
                userId,
                key => new HashSet<string> {connectionId},
                (key, set) =>
                {
                    set.Add(connectionId);
                    return set;
                });
        }

        public void Disconnected(string connectionId)
        {
        }
    }
}