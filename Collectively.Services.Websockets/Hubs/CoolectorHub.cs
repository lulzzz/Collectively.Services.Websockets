using System.Net.WebSockets;
using System.Threading.Tasks;
using Coolector.Common.Security;
using NLog;
using WebSocketManager;

namespace Collectively.Services.Websockets.Hubs
{
    public class CoolectorHub : WebSocketHandler
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IJwtTokenHandler _tokenHandler;
        private readonly IGroupManager _groupManager;

        public CoolectorHub(WebSocketConnectionManager connectionManager,
            IJwtTokenHandler tokenHandler, IGroupManager groupManager) 
            : base(connectionManager)
        {
            _tokenHandler = tokenHandler;
            _groupManager = groupManager;
        }

        public override async Task OnConnected(WebSocket socket)
        {
            await base.OnConnected(socket);
            var connectionId = WebSocketConnectionManager.GetId(socket);
            Logger.Debug($"Connected to Hub, connectionId:{connectionId}");
        }

        public override async Task OnDisconnected(WebSocket socket)
        {
            var connectionId = WebSocketConnectionManager.GetId(socket);
            Logger.Debug($"Disconnected from Hub, connectionId:{connectionId}");
            _groupManager.RemoveConnection(connectionId);
            await base.OnDisconnected(socket);
        }

        public async Task InitializeAsync(string socketId, string header)
        {
            var token = _tokenHandler.GetFromAuthorizationHeader(header);
            if (_tokenHandler.IsValid(token) == false)
            {
                Logger.Debug("Authorization token is invalid, disconnecting client");
                await InvokeClientMethodAsync(socketId, "disconnect", null);
                return;
            }
            Logger.Debug("Authorization token is valid");
            var userId = token.Sub;
            _groupManager.AddToGroup(userId, socketId);
            Logger.Debug($"Assigning ConnectionId:{socketId} to user:{userId}");
        }

        public async Task InvokeClientGroupMethodAsync(string groupName, string methodName, params object[] arguments)
        {
            var socketIds = _groupManager.GetGroupConnectionIds(groupName);
            foreach (var socketId in socketIds)
            {
                if (WebSocketConnectionManager.GetSocketById(socketId) == null)
                    continue;

                await InvokeClientMethodAsync(socketId, methodName, arguments);
            }
        }
    }
}