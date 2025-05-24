using Domain.Contracts;
using Domain.Models;
using FluentValidation;
using Services.Abstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Validators
{
    public class DoctorValidator :  AbstractValidator<Doctor>
    {
        public DoctorValidator(IUnitOfWork unitOfWork) {
            #region Person Validation
            RuleFor(p => p.FirstName)
                .NotEmpty()
                .Matches(@"^[a-zA-Z]+$")
                .MaximumLength(50)
                .WithMessage("First Name must be less than 50 characters and contain only letters");

            RuleFor(p => p.LastName)
                .NotEmpty()
                .Matches(@"^[a-zA-Z]+$")
                .MaximumLength(50)
                .WithMessage("Last Name must be less than 50 characters and contain only letters");

            RuleFor(p => p.Email)
                .NotEmpty()
                .Matches(@"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.com$")
                .WithMessage("Invalid email address format");

            RuleFor(p => p.BirthDate)
                .NotEmpty()
                .Must(d => DateTime.Now.Year - d.Year >= 10);

            RuleFor(p => p.PhoneNumber)
                .NotEmpty()
                .MaximumLength(11)
                .Matches(@"^0\d{10}$")
                .WithMessage("Invalid phone number");
            #endregion

            RuleFor(d => d.SpecialtyID)
                .MustAsync(async (id, cancellation) =>  await unitOfWork.GetRepository<Specialty,int>().GetByIdAsync(id) != null )
                .WithMessage("Specialty does not exist");

            RuleFor(d => d.Fees)
                .GreaterThanOrEqualTo(0).WithMessage("Fees cannot be negative");

            RuleFor(d => d.WaitingTime)
                .InclusiveBetween(0, 60).WithMessage("Waiting time must be between 0 and 60 minutes");

            RuleFor(d => d.OverallRating)
                .InclusiveBetween(0, 5).WithMessage("Rating must be between 0 and 5");

            RuleFor(d => d.ImageURL)
                .NotEmpty().When(d => string.IsNullOrEmpty(d.ImageURL))
                .WithMessage("Image URL is required when no image file is provided")
                .MaximumLength(500).WithMessage("Image URL cannot exceed 500 characters");

            RuleFor(d => d.About)
                .MaximumLength(500).WithMessage("About section cannot exceed 500 characters");

            RuleFor(d => d.WorkingDays)
                .IsInEnum().WithMessage("Invalid working days value");

            RuleFor(d => d.DefaultStartTime)
                .LessThan(d => d.DefaultEndTime)
                .When(d => d.DefaultEndTime != default)
                .WithMessage("Start time must be before end time");

            RuleFor(d => d.DefaultEndTime)
                .GreaterThan(d => d.DefaultStartTime)
                .When(d => d.DefaultStartTime != default)
                .WithMessage("End time must be after start time");

            RuleFor(d => d.DefaultMaxReservations)
                .GreaterThan(0).WithMessage("Maximum reservations must be greater than 0")
                .LessThanOrEqualTo(100).WithMessage("Maximum reservations cannot exceed 100");

            RuleFor(d => d.Location)
                .NotEmpty().WithMessage("Location is required")
                .MaximumLength(200).WithMessage("Location cannot exceed 200 characters");

            RuleFor(d => d.Gender)
                .IsInEnum().WithMessage("Invalid gender value");

            RuleFor(d => d.Lat)
                .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90");

            RuleFor(d => d.Lng)
                .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180");

        }
    }
}
