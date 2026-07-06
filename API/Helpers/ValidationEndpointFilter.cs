using System.ComponentModel.DataAnnotations;
using API.Errors;

namespace API.Helpers;

public sealed class ValidationEndpointFilter<T> : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var argument = context.Arguments.OfType<T>().FirstOrDefault();
        if (argument is null)
        {
            return await next(context);
        }

        var validationResults = new List<ValidationResult>();
        if (Validator.TryValidateObject(argument, new ValidationContext(argument), validationResults, true))
        {
            return await next(context);
        }

        return Results.BadRequest(new ApiValidationErrorResponse
        {
            Errors = validationResults.Select(r => r.ErrorMessage ?? string.Empty).ToArray()
        });
    }
}

public static class ValidationEndpointExtensions
{
    public static RouteHandlerBuilder WithValidation<T>(this RouteHandlerBuilder builder) =>
        builder.AddEndpointFilter(new ValidationEndpointFilter<T>());
}
