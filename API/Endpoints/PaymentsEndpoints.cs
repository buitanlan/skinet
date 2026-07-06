using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;

namespace API.Endpoints;

public static class PaymentsEndpoints
{
    private const string WhSecret = "whsecUI63M9JxKIjGakHuEQgpEPeTLOaMnpJx";

    public static RouteGroupBuilder MapPaymentsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/payments").WithTags("Payments");

        group.MapPost("/{basketId}", CreateOrUpdatePaymentIntent).RequireAuthorization();
        group.MapPost("/webhook", StripeWebhook).AllowAnonymous();

        return group;
    }

    private static async Task<IResult> CreateOrUpdatePaymentIntent(
        string basketId,
        IPaymentService paymentService)
    {
        var basket = await paymentService.CreateOrUpdatePaymentIntent(basketId);
        if (basket is null) return Results.BadRequest(new ApiResponse(400, "Problem with your basket"));
        return Results.Ok(basket);
    }

    private static async Task<IResult> StripeWebhook(
        HttpContext httpContext,
        IPaymentService paymentService,
        ILogger<IPaymentService> logger)
    {
        var json = await new StreamReader(httpContext.Request.Body).ReadToEndAsync();
        var stripeEvent = EventUtility.ConstructEvent(json, httpContext.Request.Headers["Stripe-Signature"], WhSecret);

        PaymentIntent intent;
        Order order;

        switch (stripeEvent.Type)
        {
            case "paymentintentsucceeded":
                intent = (PaymentIntent)stripeEvent.Data.Object;
                logger.LogInformation("Payment Succeeded: {PaymentIntentId}", intent.Id);
                order = await paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                logger.LogInformation("Order updated to payment received: {OrderId}", order.Id);
                break;

            case "paymentintentfailed":
                intent = (PaymentIntent)stripeEvent.Data.Object;
                logger.LogInformation("Payment Failed: {PaymentIntentId}", intent.Id);
                order = await paymentService.UpdateOrderPaymentFailed(intent.Id);
                logger.LogInformation("Payment Failed: {OrderId}", order.Id);
                break;
        }

        return Results.Ok();
    }
}
