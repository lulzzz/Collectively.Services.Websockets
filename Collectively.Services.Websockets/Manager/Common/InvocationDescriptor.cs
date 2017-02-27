using Newtonsoft.Json;

namespace Collectively.Services.Websockets.Manager.Common
{
    public class InvocationDescriptor
    {
        [JsonProperty("methodName")]
        public string MethodName { get; set; }

        [JsonProperty("arguments")]
        public object[] Arguments { get; set; }
    }
}