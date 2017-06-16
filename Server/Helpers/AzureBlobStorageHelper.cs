using System;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using Microsoft.Extensions.Options;
using Server.Services;

namespace Server.Helpers
{
    public interface IAzureBlobStorageHelper
    {
        string GetAuthorizationHeader(DateTime now, HttpWebRequest request);
    }

    public class AzureBlobStorageHelper : IAzureBlobStorageHelper
    {
        private const string StorageAccount = "ksocial";
        private const string StorageKey = "oKfFZeuDaUXkZQDfvWLdTHaZb8ItH4fPBVmZZ6LJBYwePNH003T7kcW9eC5bMu7XH68dChib7BerCbqydbdzpA==";
        private readonly IAzureStorageSettings azureStorageSettings;

        public AzureBlobStorageHelper(IOptions<AzureStorageSettings> azureStorageSettings)
        {
            this.azureStorageSettings = azureStorageSettings.Value;
        }

        private static string GetCanonicalizedHeaders(HttpWebRequest request)
        {
            var headers =
                from headerName in request.Headers.AllKeys
                let headerNameLowerCase = headerName.ToLowerInvariant()
                where headerNameLowerCase.StartsWith("x-ms-", StringComparison.Ordinal)
                orderby headerNameLowerCase
                let headerValue = request.Headers[headerName]?.TrimStart(null)?.Replace("\r\n", string.Empty)
                select $"{headerNameLowerCase}:{headerValue}";
            return string.Join("\n", headers);
        }

        public string GetAuthorizationHeader(DateTime now, HttpWebRequest request)
        {
            var messageSignature = String.Format("{0}\n\n{1}\n\n{2}\n{3}",
                request.Method,
                request.ContentType,
                GetCanonicalizedHeaders(request),
                $"/{StorageAccount}{request.RequestUri.AbsolutePath}"
            );

            var sha256 = new HMACSHA256(Convert.FromBase64String(StorageKey));
            var signatureBytes = System.Text.Encoding.UTF8.GetBytes(messageSignature);
            var signature = Convert.ToBase64String(sha256.ComputeHash(signatureBytes));
            return $"SharedKeyLite {StorageAccount}:{signature}";
        }
    }
}