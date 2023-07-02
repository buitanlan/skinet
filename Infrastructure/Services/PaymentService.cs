using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.Extensions.Configuration;
using Stripe;
using Order = Core.Entities.OrderAggregate.Order;
using Product = Core.Entities.Product;

namespace Infrastructure.Services;

public class PaymentService(IBasketRepository basketRepo, IUnitOfWork unitOfWork, IConfiguration config) : IPaymentService
{
    public async Task<CustomerBasket?> CreateOrUpdatePaymentIntent(string basketId)
    {
        StripeConfiguration.ApiKey = config["StripeSettingS:SecretKey"];
        var basket = await basketRepo.GetBasketAsync(basketId);

        if (basket is null) return null;

        var shippingPrice = 0m;
        if (basket.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await unitOfWork.Repository<DeliveryMethod>()
                .GetByIdAsync((int)basket.DeliveryMethodId);
            shippingPrice = deliveryMethod.Price;
        }

        foreach (var item in basket.Items)
        {
            var productItem = await unitOfWork.Repository<Product>()
                .GetByIdAsync(item.Id);
            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }
        }

        var service = new PaymentIntentService();
        PaymentIntent intent;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)basket.Items.Sum(x => x.Quantity * (x.Price * 100)) +
                (long)shippingPrice * 100,
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "card" }
            };

            intent = await service.CreateAsync(options);
            basket.PaymentIntentId = intent.Id;
            basket.ClientSecret = intent.ClientSecret;
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = (long)basket.Items.Sum(x => x.Quantity * (x.Price * 100)) +
                    (long)shippingPrice * 100
            };

            await service.UpdateAsync(basket.PaymentIntentId, options);
        }


        await basketRepo.UpdateBasketAsync(basket);
        return basket;
    }

    public async Task<Order?> UpdateOrderPaymentFailed(string paymentIntentId)
    {
        var spec = new OrderByPaymentIntentIdWithItemsSpecification(paymentIntentId);
        var order = await unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

        if (order is null) return null;

        order.Status = OrderStatus.PaymentFailed;
        await unitOfWork.Complete();

        return order;
    }

    public async Task<Order?> UpdateOrderPaymentSucceeded(string paymentIntentId)
    {
        var spec = new OrderByPaymentIntentIdWithItemsSpecification(paymentIntentId);
        var order = await unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

        if (order is null) return null;

        order.Status = OrderStatus.PaymentReceived;
        unitOfWork.Repository<Order>().Update(order);

        await unitOfWork.Complete();

        return order;
    }
}
