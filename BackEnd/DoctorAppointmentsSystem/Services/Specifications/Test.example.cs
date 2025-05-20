using Domain.Contracts;
using Domain.Models;

namespace Services.Specifications
{
    internal class OrderSpecifications : SpecificationsBase<Order>
    {
        public OrderSpecifications(Guid Id) : base(o => o.Id == Id)
        {
            AddInclude(o => o.DeliveryMethod);
            AddInclude(o => o.OrderItems);
        }

        public OrderSpecifications(string email) : base(o => o.UserEmail == email)
        {
            AddInclude(o => o.DeliveryMethod);
            AddInclude(o => o.OrderItems);
            SetOrderBy(o => o.OrderDate);
        }
    }
}