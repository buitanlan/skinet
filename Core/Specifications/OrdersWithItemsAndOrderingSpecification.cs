using System;
using System.Linq.Expressions;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrdersWithItemsAndOrderingSpecification: BaseSpecification<Order>
    {
        public OrdersWithItemsAndOrderingSpecification(string email ) 
            : base(o =>o.BuyerEmail == email)
        {
            AddIncluded(o => o.OrderItems);
            AddIncluded(o => o.DeliveryMethod);
        }
        public OrdersWithItemsAndOrderingSpecification(int id, string email)
            : base(o => o.Id == id && o.BuyerEmail ==email)
        {
            AddIncluded(o => o.OrderItems);
            AddIncluded(o => o.DeliveryMethod);
        }
    }
}