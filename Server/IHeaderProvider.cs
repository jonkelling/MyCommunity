using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Server
{
    public interface IHeaderProvider
    {
        IDictionary<string, StringValues> Headers { get; }
    }
}
