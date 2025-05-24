using Domain.Contracts;
using Domain.Exceptions;
using Domain.Models;
using Domain.Models.Enums;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Services.Abstraction;
using Shared.Authentication;
using Shared.DTOs.Account;
using Shared.DTOs.Email;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace Services
{
    public class AuthenticationService(UserManager<AppUser> userManager
        , IUnitOfWork unitOfWork,
        IOptions<JWTOptions> options
        , IConfiguration configuration,
        Abstraction.IEmailService _emailService
        ) : Abstraction.IAuthenticationService
    {
        public async Task<bool> CheckEmailExist(string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            return user != null;
        }

        /// <summary>
        /// Get User By Email
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        /// <exception cref="UnAuthorizedException"></exception>
        public async Task<UserResultDto> GetUserByEmail(string email)
        {
            var user = await userManager.FindByEmailAsync(email) ?? throw new UnAuthorizedException($"Email ({email}) Not Found!");
            return new UserResultDto(user.Email, await CreateTokenAsync(user));
        }

        /// <summary>
        /// Login Method
        /// for login user 
        /// </summary>
        /// <param name="loginDto"></param>
        /// <returns></returns>
        /// <exception cref="UnAuthorizedException"></exception>
        public async Task<UserResultDto> LoginAsync(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) throw new UnAuthorizedException("Email Not Found!!");

            if (!user.EmailConfirmed) throw new UnAuthorizedException("Email Not Confirmed");

            var Result = await userManager.CheckPasswordAsync(user, loginDto.Password);
            if (Result == false) throw new UnAuthorizedException("Invalid Password !!");

            return new UserResultDto
            (
                Email: user.Email,
                //DisplayName: $"{user.FirstName} {user.LastName}",
                Token: await CreateTokenAsync(user)
            );
        }

        /// <summary>
        /// register Patient   
        /// </summary>
        /// <param name="registerDto"></param>
        /// <returns></returns>
        /// <exception cref="ValidationException"></exception>
        public async Task<UserResultDto> RegisterAsync(RegisterDto registerDto)
        {
            var user = new AppUser
            {

                Email = registerDto.Email,
                UserName = $"{registerDto.FirstName}{registerDto.LastName}{registerDto.Email}",
                Person = new Patient
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    BirthDate = registerDto.BirthDate.ToDateTime(new TimeOnly()),
                    Governorate = (Governorate)registerDto.Governorate,
                    Email = registerDto.Email,
                    PhoneNumber = registerDto.PhoneNumber
                }



            };

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                throw new ValidationException(errors);
            }

            var patient = (Patient)user.Person;

            patient.AppUserID = user.Id;
            unitOfWork.GetRepository<Patient, int>().AddAsync(patient);

            await userManager.AddToRoleAsync(user, "PATIENT");
            await SendEmailConfirmationAsync(registerDto, user);

            return new UserResultDto(
                    user.Email,
                   Token: await CreateTokenAsync(user)
                );
        }

        /// <summary>
        /// Register Doctor
        /// </summary>
        /// <param name="registerDto"></param>
        /// <returns></returns>
        /// <exception cref="ValidationException"></exception>
        public async Task<UserResultDto> RegisterDoctorAsync(RegisterDto registerDto)
        {
            var user = new AppUser
            {

                Email = registerDto.Email,
                UserName = $"{registerDto.FirstName}{registerDto.LastName}{registerDto.Email}",
                Person = new Doctor
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    BirthDate = registerDto.BirthDate.ToDateTime(new TimeOnly()),
                    Governorate = (Governorate)registerDto.Governorate,
                    Email = registerDto.Email,
                    PhoneNumber = registerDto.PhoneNumber,

                }



            };

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                throw new ValidationException(errors);
            }

            var patient = (Patient)user.Person;

            patient.AppUserID = user.Id;
            unitOfWork.GetRepository<Patient, int>().AddAsync(patient);

            await userManager.AddToRoleAsync(user, "PATIENT");
            await SendEmailConfirmationAsync(registerDto, user);

            return new UserResultDto(
                    user.Email,
                   Token: await CreateTokenAsync(user)
            );
        }

        private async Task SendEmailConfirmationAsync(RegisterDto registerDto, AppUser user)
        {
            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
            var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
            var frontendUrl = configuration["FrontEnd:Url"];
            _emailService.SendEmail(new EmailDTO
            {
                To = registerDto.Email,
                Subject = "Confirm Your Email",
                Link = $"https://cima-zeta.vercel.app/confirm-success?email={registerDto.Email}&token={codeEncoded}",
                Template = MailTemplates.ConfirmEmailTemplate
            }, $"{registerDto.FirstName} {registerDto.LastName}");
        }

        private async Task<string> CreateTokenAsync(AppUser user)
        {
            var jwtOptions = options.Value;
            var authClaims = new List<Claim>
            {
                //new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new(ClaimTypes.Email, user.Email),
            };

            var Roles = await userManager.GetRolesAsync(user);
            foreach (var role in Roles)
                authClaims.Add(new(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey));
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken
                (
                    audience: jwtOptions.Audience,
                    issuer: jwtOptions.Issuer,
                    expires: DateTime.UtcNow.AddDays(jwtOptions.DurationInDays),
                    claims: authClaims,
                    signingCredentials: signingCredentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> ChangePasswordAsync(string email, string oldPassword, string newPassword)
        {
            var user = await userManager.FindByEmailAsync(email) ?? throw new Exception("User Not Found!");
            var result = await userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            if (!result.Succeeded)
                throw new Exception("Failed to Change Password!");
            return result.Succeeded;
        }

        public async Task<string> ForgetPasswordAsync(string email, string firstName, string lastName)
        {
            var user = await userManager.FindByEmailAsync(email) ?? throw new Exception("User Not Found!");
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
            var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);

            //_emailService.SendEmail(new EmailDTO
            //{
            //    To = email,
            //    Subject = "Reset Password",
            //    Link = $"https://cima-zeta.vercel.app/reset-password?email={email}&token={codeEncoded}",
            //    Template = MailTemplates.ForgotPasswordTemplate
            //}, $"{firstName} {lastName}");

            if (token == null)
                throw new Exception("Failed to Generate Reset Password Token!");
            return token;
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await userManager.FindByEmailAsync(email) ?? throw new Exception("User Not Found!");
            var codeDecodedBytes = WebEncoders.Base64UrlDecode(token);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

            var result = await userManager.ResetPasswordAsync(user, codeDecoded, newPassword);
            if (!result.Succeeded)
                throw new Exception("Failed to Reset Password!");

            return result.Succeeded;
        }
    }
}