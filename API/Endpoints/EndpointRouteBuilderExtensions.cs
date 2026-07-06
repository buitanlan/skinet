namespace API.Endpoints;

public static class EndpointRouteBuilderExtensions
{
    public static WebApplication MapApiEndpoints(this WebApplication app)
    {
        app.MapProductsEndpoints();
        app.MapAccountEndpoints();
        app.MapBasketEndpoints();
        app.MapOrdersEndpoints();
        app.MapPaymentsEndpoints();
        app.MapBuggyEndpoints();
        app.MapErrorEndpoints();

        return app;
    }
}
