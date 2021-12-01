using API.Helpers;

namespace API.Dtos;

public class ProductPhotoDto
{
    [MaxFileSize(2 * 1024 * 1024)]
    [AllowedExtensions(new[] { ".jpg", ".png", ".jpeg" })]
    public IFormFile? Photo { get; set; }
}
