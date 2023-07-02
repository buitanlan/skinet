using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services;

public class OrderService(
    IBasketRepository basketRepo,
    IUnitOfWork unitOfWork,
    IPaymentService paymentService) : IOrderService
{
    public async Task<Order?> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
    {
        //get basket from repo
        var basket = await basketRepo.GetBasketAsync(basketId);
        //get item from produtc repo
        var items = new List<OrderItem>();
        foreach (var item in basket.Items)
        {
            int index = item.PictureUrl.IndexOf("images/products/", StringComparison.Ordinal);
            string pictureUrl = item.PictureUrl.Substring(index);
            var productItem = await unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
            var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, pictureUrl);
            var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
            items.Add(orderItem);
        }

        //get delivery method from repo
        var deliveryMethod = await unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

        //calc subtotal
        var subtotal = items.Sum(item => item.Quantity * item.Price);

        // check  to see if order exists
        var spec = new OrderByPaymentIntentIdWithItemsSpecification(basket.PaymentIntentId);
        var existingOrder = await unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        if (existingOrder is {})
        {
            unitOfWork.Repository<Order>().Delete(existingOrder);
            await paymentService.CreateOrUpdatePaymentIntent(basket.PaymentIntentId);
        }

        //create order 
        var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal, basket.PaymentIntentId);
        unitOfWork.Repository<Order>().Add(order);

        // save to db
        var result = await unitOfWork.Complete();
        if (result <= 0) return null;

        // return db
        return order;

    }

    public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
    {
        return await unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
    }

    public async Task<Order?> GetOrderByIdAsync(int id, string buyerEmail)
    {
        var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
        return await unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
    }

    public async Task<IReadOnlyList<Order?>> GetOrdersForUserAsync(string buyerEmail)
    {
        var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
        return await unitOfWork.Repository<Order>().ListAsync(spec);
    }
}
