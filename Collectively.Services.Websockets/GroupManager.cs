using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace Collectively.Services.Websockets
{
    public interface IGroupManager
    {
        void AddToGroup(string groupName, string connectionId);
        void RemoveConnection(string connectionId);
        IEnumerable<string> GetGroupConnectionIds(string groupName);
    }

    public class GroupManager : IGroupManager
    {
        private readonly ConcurrentDictionary<string, HashSet<string>> _groups;
        private ConcurrentDictionary<string, HashSet<string>> _connections;

        public GroupManager()
        {
            _groups = new ConcurrentDictionary<string, HashSet<string>>();
            _connections = new ConcurrentDictionary<string, HashSet<string>>();
        }

        public void AddToGroup(string groupName, string connectionId)
        {
            _groups.AddOrUpdate(groupName,
                name => new HashSet<string> {connectionId},
                (name, set) =>
                {
                    set.Add(connectionId);
                    return set;
                });
            _connections.AddOrUpdate(connectionId,
                id => new HashSet<string> {groupName},
                (id, set) =>
                {
                    set.Add(groupName);
                    return set;
                });
        }

        public void RemoveConnection(string connectionId)
        {
            HashSet<string> groups;
            if (_connections.TryRemove(connectionId, out groups) == false)
                return;

            foreach (var @group in groups)
            {
                _groups.AddOrUpdate(@group,
                name => new HashSet<string>(),
                (name, set) =>
                {
                    set.Remove(connectionId);
                    return set;
                });
            }
        }

        public IEnumerable<string> GetGroupConnectionIds(string groupName)
        {
            HashSet<string> result;
            _groups.TryGetValue(groupName, out result);

            return result ?? Enumerable.Empty<string>();
        }
    }
}