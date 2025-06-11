using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Shared.ErrorModels;
using System.Net;

namespace DoctorAppointmentsSystem.Web.Factories
{
    public class ApiResponseFactory
    {

        public static IActionResult CustomValidationErrors(ActionContext actionContext)
        {
            var Errors = actionContext.ModelState.Where(e => e.Value.Errors.Any()).
                   Select(e => new ValidationError
                   {
                       FieldId = e.Key,
                       Errors = e.Value.Errors.Select(e => e.ErrorMessage)
                   }
                   );

            var response = new ValidationErrorsResponse()
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                ErrorMessage = "Validation Problem !!"
                    ,
                Errors = Errors
            };

            return new BadRequestObjectResult(response);
        }

    }
}
