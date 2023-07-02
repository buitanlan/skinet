using System.ComponentModel.DataAnnotations;

namespace API.Helpers;

public class MaxFileSizeAttribute(int maxFileSize) : ValidationAttribute
{
    protected override ValidationResult IsValid(
        object value, ValidationContext validationContext)
    {
        var file = value as IFormFile;
        if (file is { })
        {
            if (file.Length > maxFileSize)
            {
                return new ValidationResult(GetErrorMessage());
            }
        }

        return ValidationResult.Success;
    }

    private string GetErrorMessage()
    {
        return $"Maximum allowed file size is { maxFileSize} bytes.";
    }
}
