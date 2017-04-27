using Microsoft.AspNetCore.Http;

namespace Server
{
    public interface IRequestProvider
    {
        HttpRequest Request { get; }
    }
}
