using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;

namespace API.Endpoints;

public static class OrdersEndpoints
{
    public static RouteGroupBuilder MapOrdersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders").RequireAuthorization().WithTags("Orders");

        group.MapPost("/", CreateOrder);
        group.MapGet("/", GetOrderForUser);
        group.MapGet("/{id:int}", GetOrderByIdForUser);
        group.MapGet("/deliveryMethods", GetDeliveryMethods);

        return group;
    }

    private static async Task<IResult> CreateOrder(
        OrderDto orderDto,
        HttpContext httpContext,
        IOrderService orderService,
        IMapper mapper)
    {
        var email = httpContext.User.RetrieveEmailFromPrincipal();
        var address = mapper.Map<AddressDto, Address>(orderDto.ShipToAddress);
        var order = await orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId,
            orderDto.BasketId, address);
        if (order is null)
            return Results.BadRequest(new ApiResponse(400, "Problem creating order"));
        return Results.Ok(order);
    }

    private static async Task<IResult> GetOrderForUser(
        HttpContext httpContext,
        IOrderService orderService,
        IMapper mapper)
    {
        var email = httpContext.User.RetrieveEmailFromPrincipal();
        var orders = await orderService.GetOrdersForUserAsync(email);
        return Results.Ok(mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders));
    }

    private static async Task<IResult> GetOrderByIdForUser(
        int id,
        HttpContext httpContext,
        IOrderService orderService,
        IMapper mapper)
    {
        var email = httpContext.User.RetrieveEmailFromPrincipal();
        var order = await orderService.GetOrderByIdAsync(id, email);
        if (order is null) return Results.NotFound(new ApiResponse(404));
        return Results.Ok(mapper.Map<Order, OrderToReturnDto>(order));
    }

    private static async Task<IResult> GetDeliveryMethods(IOrderService orderService) =>
        Results.Ok(await orderService.GetDeliveryMethodsAsync());
}
