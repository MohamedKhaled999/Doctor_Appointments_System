using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using Shared.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    public class AuthenticationController(IServiceManager serviceManager):ApiController
    {

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Implement registration logic here

            // You can use the serviceManager to access the authentication service
           var  result =  await serviceManager.AuthenticationService.RegisterAsync(registerDto);

            return Ok(result);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Implement login logic here
            
            var result = await serviceManager.AuthenticationService.LoginAsync(loginDto);

            return Ok(result);
        }
        [HttpPost("doctor-register")]
        public async Task<IActionResult> DoctorRegister([FromForm] DoctorRegisterDto doctorRegisterDto)
        {

            // Implement doctor registration logic here
         var result =    await serviceManager.AuthenticationService.RegisterAsync(doctorRegisterDto);

            return Ok(result);
        }

        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto confirmEmailDto)
        {
            var result = await serviceManager.AuthenticationService.ConfirmEmailAsync(confirmEmailDto);
            return Ok(result);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] Shared.Authentication.ForgotPasswordDto forgotPasswordDto)
        {
            var result = await serviceManager.AuthenticationService.ForgetPasswordAsync(forgotPasswordDto);
            return Ok(result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] Shared.Authentication.ResetPasswordDto resetPasswordDto)
        {
            var result = await serviceManager.AuthenticationService.ResetPasswordAsync(resetPasswordDto);
            return Ok(result);
        }

        //change password

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var result = await serviceManager.AuthenticationService.ChangePasswordAsync(changePasswordDto);
            return Ok(result);
        }




    }
}
