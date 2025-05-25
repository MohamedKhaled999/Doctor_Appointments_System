using Domain.Contracts;
using Domain.Models;

namespace Services.Specifications
{
    internal class PatientPaginationSpecifications : SpecificationsBase<Patient>
    {
        public PatientPaginationSpecifications(int pageIndex = 1, int pageSize = 20) : base(null)
        {
            ApplyPagination(pageIndex, pageSize);
        }
    }
}
