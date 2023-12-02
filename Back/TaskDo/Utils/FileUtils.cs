namespace TaskDo.Utils
{
    public static class FileUtils
    {
        public static string GetFileExtension(string contentType)
        {
            switch (contentType)
            {
                case "image/jpeg":
                    return ".jpg";
                case "image/png":
                    return ".png";
                default:
                    return ".jpg";
            }
        }
    }
}
