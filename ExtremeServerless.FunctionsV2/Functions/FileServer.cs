using System.IO;
using Microsoft.Azure.WebJobs;
using System.Linq;
using Microsoft.Azure.WebJobs.Extensions.Http;
using System;
using Microsoft.Azure.WebJobs.Host;
using MimeTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace ExtremeServerless.Functions
{
    public static class FileServer
    {
        const string staticFilesFolder = "www";
        static string defaultPage =
            string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DEFAULT_PAGE")) ?
            "index.html" : Environment.GetEnvironmentVariable("DEFAULT_PAGE");

        [FunctionName("FileServer")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")]
            HttpRequest req,
            TraceWriter log,
            ExecutionContext context)
        {
            var filePath = GetFilePath(req, log, context);

            var stream = new FileStream(filePath, FileMode.Open);
            var response = new FileStreamResult(stream, new MediaTypeHeaderValue(GetMimeType(filePath)));

            return response;
        }

        private static string GetFilePath(HttpRequest req, TraceWriter log, ExecutionContext context)
        {
            var pathValue = req.GetQueryParameterDictionary()
                .FirstOrDefault(q => string.Compare(q.Key, "file", true) == 0)
                .Value;

            var path = pathValue ?? "";

            var staticFilesPath = Path.GetFullPath(Path.Combine(context.FunctionAppDirectory, staticFilesFolder));
            var fullPath = Path.GetFullPath(Path.Combine(staticFilesPath, path));

            if (!IsInDirectory(staticFilesPath, fullPath))
            {
                throw new ArgumentException("Invalid path");
            }

            var isDirectory = Directory.Exists(fullPath);
            if (isDirectory)
            {
                fullPath = Path.Combine(fullPath, defaultPage);
            }

            return fullPath;
        }

        private static bool IsInDirectory(string parentPath, string childPath)
        {
            var parent = new DirectoryInfo(parentPath);
            var child = new DirectoryInfo(childPath);

            var dir = child;
            do
            {
                if (dir.FullName == parent.FullName)
                {
                    return true;
                }
                dir = dir.Parent;
            } while (dir != null);

            return false;
        }

        private static string GetMimeType(string filePath)
        {
            var fileInfo = new FileInfo(filePath);

            return MimeTypeMap.GetMimeType(fileInfo.Extension);
        }
    }
}
