using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OrdersController(IOrderService orderService, IMapper mapper) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
    {
        var email = HttpContext.User.RetrieveEmailFromPrincipal();
        var address = mapper.Map<AddressDto, Address>(orderDto.ShipToAddress);
        var order = await orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId,
         orderDto.BasketId, address);
        if (order is null)
            return BadRequest(new ApiResponse(400, "Problem creating order"));
        return Ok(order);
    }
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrderForUser()
    {
        var email = HttpContext.User.RetrieveEmailFromPrincipal();
        var orders = await orderService.GetOrdersForUserAsync(email);
        return Ok(mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders));

    }
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
    {
        var email = HttpContext.User.RetrieveEmailFromPrincipal();
        var order = await orderService.GetOrderByIdAsync(id, email);

        if (order is null) return NotFound(new ApiResponse(404));
        return mapper.Map<Order, OrderToReturnDto>(order);
    }
    [HttpGet("deliveryMethods")]
    public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
    {
        return Ok(await orderService.GetDeliveryMethodsAsync());
    }
}
