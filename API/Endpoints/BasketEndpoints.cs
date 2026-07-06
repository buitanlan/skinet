using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;

namespace API.Endpoints;

public static class BasketEndpoints
{
    public static RouteGroupBuilder MapBasketEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/basket").WithTags("Basket");

        group.MapGet("/", GetBasketById);
        group.MapPost("/", UpdateBasket);
        group.MapDelete("/", DeleteBasketAsync);

        return group;
    }

    private static async Task<IResult> GetBasketById(string id, IBasketRepository basketRepository)
    {
        var basket = await basketRepository.GetBasketAsync(id);
        return Results.Ok(basket ?? new CustomerBasket(id));
    }

    private static async Task<IResult> UpdateBasket(
        CustomerBasketDto basket,
        IBasketRepository basketRepository,
        IMapper mapper)
    {
        var customerBasket = mapper.Map<CustomerBasketDto, CustomerBasket>(basket);
        var updatedBasket = await basketRepository.UpdateBasketAsync(customerBasket);
        return Results.Ok(updatedBasket);
    }

    private static async Task<IResult> DeleteBasketAsync(string id, IBasketRepository basketRepository)
    {
        await basketRepository.DeleteBasketAsync(id);
        return Results.NoContent();
    }
}
