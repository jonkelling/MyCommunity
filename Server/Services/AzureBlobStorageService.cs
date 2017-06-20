using System;
using System.Collections;
using System.Collections.Specialized;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Server;
using Server.Helpers;

namespace Server.Services
{
    public interface IAzureBlobStorageService
    {
        Task<byte[]> GetBlob(string filename);
        Task<string> PutBlob(string filename, byte[] data);
    }

    public class AzureBlobStorageService : IAzureBlobStorageService
    {
        private const string baseurl = "https://ksocial.blob.core.windows.net/mycommunityuploads";
        private readonly IAzureBlobStorageHelper azureBlobStorageHelper;
        private readonly AzureStorageSettings azureStorageSettings;

        public AzureBlobStorageService(
            IAzureBlobStorageHelper azureBlobStorageHelper,
            IOptions<AzureStorageSettings> azureStorageSettings)
        {
            this.azureBlobStorageHelper = azureBlobStorageHelper;
            this.azureStorageSettings = azureStorageSettings.Value;
        }

        public async Task<byte[]> GetBlob(string filename)
        {
            var uriBuilder = new UriBuilder($"{baseurl}/{filename}");
            uriBuilder.Query = azureStorageSettings.SASToken;
            var req = HttpWebRequest.CreateHttp(uriBuilder.Uri);

            using (var response = await req.GetResponseAsync())
            using (var rs = response.GetResponseStream())
                return rs.ReadAllBytes();
        }

        public async Task<string> PutBlob(string filename, byte[] data)
        {
            try
            {
                var baseFilename = Path.GetFileNameWithoutExtension(filename);
                var guid = Guid.NewGuid();
                var fileExtension = Path.GetExtension(filename);
                var newFilename = $"{baseFilename}_{guid}{fileExtension}";
                var uriBuilder = new UriBuilder($"{baseurl}/{newFilename}")
                {
                    Query = azureStorageSettings.SASToken
                };
                var req = HttpWebRequest.CreateHttp(uriBuilder.Uri);
                req.Headers["x-ms-blob-type"] = "BlockBlob";
                req.Headers["x-ms-date"] = DateTime.UtcNow.ToString("r");
                req.Headers["x-ms-version"] = "2016-05-31";
                req.Method = "PUT";
                req.ContentType = "application/octet-stream";
                using (var s = await req.GetRequestStreamAsync())
                    await s.WriteAsync(data, 0, data.Length);
                using (var response = (HttpWebResponse)(await req.GetResponseAsync()))
                using (var rs = response.GetResponseStream())
                {
                    var bytes = rs.ReadAllBytes();
                }
                return newFilename;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // public async Task<byte[]> PutBlob(string filename)
        // {
        //     Console.WriteLine(DateTime.UtcNow.ToString("r"));
        //     var uri = $"{baseurl}/{filename}";
        //     var req = HttpWebRequest.CreateHttp(uri);
        //     req.Headers["x-ms-blob-type"] = "BlockBlob";
        //     req.Headers["x-ms-date"] = DateTime.UtcNow.ToString("r");
        //     req.Headers["x-ms-version"] = "2016-05-31";
        //     req.Method = "PUT";
        //     req.ContentType = "application/octet-stream";
        //     var authHeader = azureBlobStorageHelper.GetAuthorizationHeader(DateTime.UtcNow, req);
        //     req.Headers["Authorization"] = authHeader;

        //     using (var s = await req.GetRequestStreamAsync())
        //     {
        //         var bytes = File.ReadAllBytes("/Users/jonkelling/Desktop/clouds_building.jpg");
        //         await s.WriteAsync(bytes, 0, bytes.Length);
        //     }

        //     using (var response = (HttpWebResponse)(await req.GetResponseAsync()))
        //     using (var rs = response.GetResponseStream())
        //     {
        //         byte[] buffer = new byte[rs.Length];
        //         await rs.ReadAsync(buffer, 0, Convert.ToInt32(rs.Length));
        //         return buffer;
        //     }
        // }
    }
}