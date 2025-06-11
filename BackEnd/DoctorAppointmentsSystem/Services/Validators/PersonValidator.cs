using Domain.Models;
using FluentValidation;

namespace Services.Validators
{
    public class PersonValidator : AbstractValidator<Person>
    {
        public PersonValidator()
        {
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
        }
    }
}
