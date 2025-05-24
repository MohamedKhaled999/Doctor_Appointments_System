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
        public async Task<IActionResult> DoctorRegister([FromBody] DoctorRegisterDto doctorRegisterDto)
        {
            // Implement doctor registration logic here
            return Ok();
        }


    }
}
