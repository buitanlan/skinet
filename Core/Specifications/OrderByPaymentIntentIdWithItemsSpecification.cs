using Core.Entities.OrderAggregate;

namespace Core.Specifications;

public class OrderByPaymentIntentIdWithItemsSpecification(string paymentIntentId) : BaseSpecification<Order>(o => o.PaymentIntentId == paymentIntentId);
