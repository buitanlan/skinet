using API.Dtos;
using AutoMapper;
using Core.Entities.OrderAggregate;

namespace API.Helpers;

public class OrderItemUrlResolver(IConfiguration config) : IValueResolver<OrderItem, OrderItemDto, string>
{
    public string? Resolve(OrderItem source, OrderItemDto destination, string destMember,
    ResolutionContext context)
    {
        if (!string.IsNullOrEmpty(source.ItemOrdered.PictureUrl))
        {
            return config["ApiUrl"] + source.ItemOrdered.PictureUrl;
        }
        return null;
    }
}
