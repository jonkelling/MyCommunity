using System;

namespace Server.Services
{
    public interface IAzureStorageSettings
    {
        string SASToken { get; }
    }

    public class AzureStorageSettings : IAzureStorageSettings
    {
        public string SASToken { get; set; }
    }
}