using System.ComponentModel.DataAnnotations;

namespace API.Helpers;

public class AllowedExtensionsAttribute(string[] extensions) : ValidationAttribute
{
    protected override ValidationResult? IsValid(
        object? value, ValidationContext validationContext)
    {
        if (value is not IFormFile file) return ValidationResult.Success;
        var extension = Path.GetExtension(file.FileName);
        return !extensions.Contains(extension.ToLower()) ? new ValidationResult(GetErrorMessage()) : ValidationResult.Success;
    }

    private string GetErrorMessage()
    {
        return $"This file extension is not allowed!";
    }
}
