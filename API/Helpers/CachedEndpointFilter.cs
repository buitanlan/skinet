using System.Text;
using Core.Interfaces;

namespace API.Helpers;

public sealed class CachedEndpointFilter(int timeToLiveSeconds) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();
        var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);
        var cachedResponse = await cacheService.GetCacheResponseAsync(cacheKey);

        if (!string.IsNullOrEmpty(cachedResponse))
        {
            return Results.Content(cachedResponse, "application/json");
        }

        var result = await next(context);

        if (result is IValueHttpResult valueResult && valueResult.Value is not null)
        {
            await cacheService.CacheResponseAsync(cacheKey, valueResult.Value,
                TimeSpan.FromSeconds(timeToLiveSeconds));
        }

        return result;
    }

    private static string GenerateCacheKeyFromRequest(HttpRequest request)
    {
        var keyBuilder = new StringBuilder();
        keyBuilder.Append(request.Path);

        foreach (var (key, value) in request.Query.OrderBy(x => x.Key))
        {
            keyBuilder.Append($"|{key}-{value}");
        }

        return keyBuilder.ToString();
    }
}

public static class CachedEndpointExtensions
{
    public static RouteHandlerBuilder WithCache(this RouteHandlerBuilder builder, int timeToLiveSeconds) =>
        builder.AddEndpointFilter(new CachedEndpointFilter(timeToLiveSeconds));
}
