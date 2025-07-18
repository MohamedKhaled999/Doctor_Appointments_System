﻿using Domain.Contracts;
using Domain.Models;

namespace Services.Specifications.Home
{
    internal class HomeDoctorSpecifications : SpecificationsBase<Doctor>
    {
        public HomeDoctorSpecifications() : base(null)
        {
            AddInclude(d => d.Specialty);
            SetOrderByDescending(d => d.OverallRating);
        }
    }
}
