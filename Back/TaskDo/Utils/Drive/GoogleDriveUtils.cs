using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Upload;

namespace TaskDo.Utils.Drive
{
    public static class GoogleDriveUtils
    {
        public static string UploadImageToDrive(string contentRootPath, string filename)
        {
            // Load the Service account credentials and define the scope of its access.
            var credential = GoogleCredential.FromFile(Path.Combine((contentRootPath + @"Images"), GoogleDriveConst.ServiceAccountKeyFileName))
                            .CreateScoped(DriveService.ScopeConstants.Drive);

            // Create the  Drive service.
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential
            });

            // Upload file Metadata
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = filename,
                Parents = new List<string>() { GoogleDriveConst.DirectoryId }
            };
            // Create a new file on Google Drive
            var imagePath = Path.Combine(contentRootPath, "Images", filename);

            // Create a file stream for the image file
            using var fsSource = new FileStream(imagePath, FileMode.Open, FileAccess.Read);

            // Create a new file, with metadata and stream.
            var request = service.Files.Create(fileMetadata, fsSource, "image/png, image/jpg, image/jpeg");
            request.Fields = "*";
            var results = request.UploadAsync(CancellationToken.None).Result;

            if (results.Status == UploadStatus.Failed)
            {
                throw new Exception("Upload Failed.");
            }

            // the file id of the new file we created
            var imageId = request.ResponseBody.Id;

            // edit user's image
            var imageUrl = @$"https://lh3.googleusercontent.com/d/{imageId}";
            return imageUrl;
        }
    }
}
