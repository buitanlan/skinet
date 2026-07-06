using API.Errors;
using Infrastructure.Data;

namespace API.Endpoints;

public static class BuggyEndpoints
{
    public static RouteGroupBuilder MapBuggyEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/buggy").WithTags("Buggy");

        group.MapGet("/notfound", GetNotFoundRequest);
        group.MapGet("/servererror", GetServerError);
        group.MapGet("/badrequest", GetBadRequest);
        group.MapGet("/badrequest/{id:int}", GetBadRequestWithId);

        return group;
    }

    private static IResult GetNotFoundRequest(StoreContext context)
    {
        var thing = context.Products.Find(42);
        if (thing is null)
        {
            return Results.NotFound(new ApiResponse(404));
        }

        return Results.Ok();
    }

    private static IResult GetServerError(StoreContext context)
    {
        var thing = context.Products.Find(42);
        _ = thing!.ToString();
        return Results.Ok();
    }

    private static IResult GetBadRequest() => Results.BadRequest(new ApiResponse(400));

    private static IResult GetBadRequestWithId(int id) => Results.Ok();
}
