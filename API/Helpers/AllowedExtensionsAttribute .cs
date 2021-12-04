using System.ComponentModel.DataAnnotations;

namespace API.Helpers;

public class AllowedExtensionsAttribute : ValidationAttribute
{
    private readonly string[] _extensions;
    public AllowedExtensionsAttribute(string[] extensions)
    {
        _extensions = extensions;
    }

    protected override ValidationResult? IsValid(
        object? value, ValidationContext validationContext)
    {
        if (value is not IFormFile file) return ValidationResult.Success;
        var extension = Path.GetExtension(file.FileName);
        return !_extensions.Contains(extension.ToLower()) ? new ValidationResult(GetErrorMessage()) : ValidationResult.Success;
    }

    private string GetErrorMessage()
    {
        return $"This file extension is not allowed!";
    }
}
