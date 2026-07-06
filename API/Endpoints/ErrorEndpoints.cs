using API.Errors;

namespace API.Endpoints;

public static class ErrorEndpoints
{
    public static IEndpointRouteBuilder MapErrorEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/errors/{code:int}", GetError).ExcludeFromDescription();
        return app;
    }

    private static IResult GetError(int code) => Results.Json(new ApiResponse(code));
}
