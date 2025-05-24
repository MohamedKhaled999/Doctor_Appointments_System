using Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Shared.ErrorModels;
using System;
using System.Net;

namespace DoctorAppointmentsSystem.Web.Middlewares
{

    internal class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next?.Invoke(httpContext);

                if (httpContext.Response.StatusCode == (int)HttpStatusCode.NotFound)
                    await HandleNotFoundEndPointException(httpContext);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                await HandleExceptionAsync(e, httpContext);
            }
        }

        private async Task HandleExceptionAsync(Exception exception, HttpContext httpContext)
        {

            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;//500
            httpContext.Response.ContentType = "application/json";

            var response = new ErrorDetails
            {
                ErrorMessage = exception.Message,

            };
            httpContext.Response.StatusCode = exception switch
            {
                NotFoundException => (int)HttpStatusCode.NotFound,
                UnAuthorizedException => (int)HttpStatusCode.Unauthorized,
                ValidationException validationException => HandleValidationException(response, validationException),

                _ => (int)HttpStatusCode.InternalServerError
            };

            response.StatusCode = httpContext.Response.StatusCode;
            await httpContext.Response.WriteAsync(response.ToString());

        }

        private int HandleValidationException(ErrorDetails response, ValidationException validationException)
        {
            response.Errors = validationException.Errors;
            return (int)HttpStatusCode.BadRequest;
        }

        private async Task HandleNotFoundEndPointException(HttpContext httpContext)
        {

            httpContext.Response.ContentType = "application/json";
            var response = new ErrorDetails
            {
                StatusCode = httpContext.Response.StatusCode,
                ErrorMessage = $"The EndPoint {httpContext.Request.Path} is not Found"

            };

            await httpContext.Response.WriteAsync(response.ToString());

        }
    }
}