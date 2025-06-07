using AutoMapper;
using Domain.Contracts;
using Domain.Exceptions;
using Domain.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Services.Abstraction;
using Services.Abstraction.Orchestrators;
using Shared.Authentication;
using Shared.DTOs.Email;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace Services
{
    internal class AuthenticationService(
        UserManager<AppUser> userManager,
        IPatientService patientService,
        IDoctorOrchestrator doctorOrchestrator,
        IUnitOfWork unitOfWork,
        IOptions<JWTOptions> options
        , IConfiguration configuration,
        IMapper mapper,
        IEmailService _emailService
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
            var namesArr = user.UserName.Split("DocNet");

            return new UserResultDto(Email: user.Email,
                                     DisplayName: $"{namesArr[0]} {namesArr[1]}",
                                     Role: (await userManager.GetRolesAsync(user)).FirstOrDefault(),
                                     Token: await CreateTokenAsync(user));
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
            var namesArr = user.UserName.Split("DocNet");
            return new UserResultDto
            (
                Email: user.Email,
                DisplayName: $"{namesArr[0]} {namesArr[1]}",
                Role: (await userManager.GetRolesAsync(user)).FirstOrDefault(),
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
            var userEmail = await userManager.FindByEmailAsync(registerDto.Email);
            if (userEmail != null)
            {
                throw new ValidationException(new List<string> { "Email Already Exist!" });
            }

            Shared.Transaction_Pattern.Transaction transaction =
                new Shared.Transaction_Pattern.Transaction();



            var user = new AppUser
            {
                Email = registerDto.Email,
                UserName = $"{registerDto.FirstName}DocNet{registerDto.LastName}DocNet{registerDto.Email}",
            };
            transaction.Execute(() =>
            {
                var result = userManager.CreateAsync(user, registerDto.Password).Result;
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    throw new ValidationException(errors);
                }
            }, async () =>
            {
                var todelete = userManager.FindByEmailAsync(user.Email).Result;
                if (todelete != null)
                {
                    var deleteResult = userManager.DeleteAsync(todelete).Result;
                    if (!deleteResult.Succeeded)
                    {
                        var errors = deleteResult.Errors.Select(e => e.Description).ToList();
                        throw new ValidationException(errors);
                    }
                }
            });
            //var result = await userManager.CreateAsync(user, registerDto.Password);
            //if (!result.Succeeded)
            //{
            //    var errors = result.Errors.Select(e => e.Description).ToList();
            //    throw new ValidationException(errors);
            //}




            registerDto.AppUserID = user.Id;
            if (registerDto is DoctorRegisterDto doctor)
            {
                transaction.Execute(async () =>
                {
                    await doctorOrchestrator.RegisterDoctor(doctor);
                    await userManager.AddToRoleAsync(user, "doctor");
                }, async () =>
                {
                    SpecificationsBase<Doctor> specifications = new SpecificationsBase<Doctor>(d => d.AppUserID == user.Id);
                    var todelete = await unitOfWork.GetRepository<Doctor, int>().GetAllAsync(specifications);
                    if (todelete != null)
                    {
                        unitOfWork.GetRepository<Doctor, int>().Delete(todelete[0]);
                    }
                });
                //await doctorOrchestrator.RegisterDoctor(doctor);
                //await userManager.AddToRoleAsync(user, "doctor");
            }
            else
            {
                transaction.Execute(async () =>
                {
                    await patientService.AddAsync(registerDto);
                    await userManager.AddToRoleAsync(user, "patient");
                }, async () =>
                {
                    SpecificationsBase<Patient> specifications = new SpecificationsBase<Patient>(p => p.AppUserID == user.Id);
                    var todelete = await unitOfWork.GetRepository<Patient, int>().GetAllAsync(specifications);
                    if (todelete != null)
                    {
                        unitOfWork.GetRepository<Patient, int>().Delete(todelete[0]);
                    }
                });
                //await patientService.AddAsync(registerDto);
                //await userManager.AddToRoleAsync(user, "patient");
            }
            // check if u want to continue
            transaction.Complete();
            await SendEmailConfirmationAsync(registerDto, user);
            var namesArr = user.UserName.Split("DocNet");

            return new UserResultDto(
                 Email: user.Email,
                DisplayName: $"{namesArr[0]} {namesArr[1]}",
                Role: (await userManager.GetRolesAsync(user)).FirstOrDefault(),
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
                Link = $"{frontendUrl}/confirm-success?email={registerDto.Email}&token={codeEncoded}",
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
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
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

        public async Task<bool> ChangePasswordAsync(ChangePasswordDto changePasswordDto, string email)
        {
            var user = await userManager.FindByEmailAsync(email) ?? throw new Exception("User Not Found!");
            var result = await userManager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);
            if (!result.Succeeded)
                throw new UnAuthorizedException("Failed to Change Password!");
            return result.Succeeded;
        }

        public async Task<string> ForgetPasswordAsync(ForgotPasswordDto forgetPasswordDTO)
        {
            var user = await userManager.FindByEmailAsync(forgetPasswordDTO.Email) ?? throw new NotFoundException("User Not Found!");
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
            var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
            var frontendUrl = configuration["FrontEnd:Url"];


            _emailService.SendEmail(new EmailDTO
            {
                To = forgetPasswordDTO.Email,
                Subject = "Reset Password",
                Link = $"{frontendUrl}/reset-password?email={forgetPasswordDTO.Email}&token={codeEncoded}",
                Template = MailTemplates.ForgotPasswordTemplate
            }, $"{forgetPasswordDTO.FirstName} {forgetPasswordDTO.LastName}");

            if (token == null)
                throw new UnAuthorizedException("Failed to Generate Reset Password Token!");
            return token;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await userManager.FindByEmailAsync(resetPasswordDto.Email) ?? throw new NotFoundException("User Not Found!");
            var codeDecodedBytes = WebEncoders.Base64UrlDecode(resetPasswordDto.Token);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

            var result = await userManager.ResetPasswordAsync(user, codeDecoded, resetPasswordDto.NewPassword);
            if (!result.Succeeded)
                throw new UnAuthorizedException("Failed to Reset Password!");

            return result.Succeeded;
        }

        public async Task<bool> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto)
        {

            var user = await userManager.FindByEmailAsync(confirmEmailDto.Email);
            if (user is null)
            {
                throw new UnAuthorizedException($"Email Doesn't Exist !!\n {confirmEmailDto.Email}");
            }
            var codeDecodedBytes = WebEncoders.Base64UrlDecode(confirmEmailDto.Token);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);
            var result = await userManager.ConfirmEmailAsync(user, codeDecoded);
            if (result.Succeeded)
                return true;
            throw new ValidationException(result.Errors.Select(e => e.Description).ToList());


        }

        public async Task<UserResultDto> ExternalLogin(ExternalLoginDTO externalLoginDTO)
        {
            var payload = await VerifyTokenAsync(externalLoginDTO.Token, externalLoginDTO.Provider);


            // find user by email
            var user = await userManager.FindByEmailAsync(payload.Email);
            if (user == null) throw new UnAuthorizedException("Email Not Found!!");
            var isConfirmed = await userManager.IsEmailConfirmedAsync(user);
            if (!isConfirmed) throw new UnAuthorizedException("Email Not Confirmed");


            return new UserResultDto
            (
                Email: payload.Email,
                DisplayName: payload.Name,
                Role: (await userManager.GetRolesAsync(user)).FirstOrDefault(),
                Token: await CreateTokenAsync(user)
            );
        }

        private async Task<TokenResultDataDto> VerifyTokenAsync(string token, string provider)
        {
            TokenResultDataDto resultDataDto;
            provider = provider.ToLower();
            try
            {
                switch (provider)
                {
                    case "google":
                        resultDataDto = await VerifyGoogleToken(token);
                        break;
                    case "facebook":
                        resultDataDto = await VerifyFacebookToken(token);
                        break;
                    case "microsoft":
                        resultDataDto = await VerifyMicrosoftToken(token);
                        break;
                    default:
                        throw new UnAuthorizedException("Unsupported provider");
                }


                return resultDataDto;

            }
            catch (Exception ex)
            {
                throw new UnAuthorizedException($"Invalid Token :{ex.Message}");
            }

        }
        private async Task<TokenResultDataDto> VerifyGoogleToken(string idToken)
        {
            var googleCliendId = configuration["ExtrenalLogin:googleClientId"];

            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>() { googleCliendId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return new TokenResultDataDto()
            {
                Email = payload.Email,
                Name = payload.Name,
            };
        }

        public async Task<TokenResultDataDto> VerifyFacebookToken(string accessToken)
        {
            var url = $"https://graph.facebook.com/me?access_token={accessToken}&fields=id,name,email";
            var client = new HttpClient();
            var response = await client.GetStringAsync(url);
            if (string.IsNullOrEmpty(response))
            {
                throw new UnAuthorizedException("Invalid Facebook Token");
            }
            // Parse the response to extract user information
            // For simplicity, we assume the response is a JSON string containing user info

            var userInfo = System.Text.Json.JsonSerializer.Deserialize<TokenResultDataDto>(response,
                 new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

            if (userInfo == null || string.IsNullOrEmpty(userInfo.Email))
            {
                throw new UnAuthorizedException("Invalid Facebook Token");
            }

            return userInfo;
        }

        private async Task<TokenResultDataDto> VerifyMicrosoftToken(string idToken)
        {
            var microsoftClientId = configuration["ExtrenalLogin:microsoftClientId"];

            var configManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
                new OpenIdConnectConfigurationRetriever());

            var config = await configManager.GetConfigurationAsync(CancellationToken.None);

            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParams = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidIssuers = new[]
                {
            "https://login.microsoftonline.com/common/v2.0"
            //$"https://login.microsoftonline.com/643b2f85-9f93-41b9-81d6-00ccadbf0bb7/v2.0" // optional if multi-tenant
        },
                ValidateAudience = true,
                ValidAudience = microsoftClientId,
                ValidateLifetime = true,
                IssuerSigningKeys = config.SigningKeys
            };

            var principal = tokenHandler.ValidateToken(idToken, validationParams, out _);
            var email = principal.FindFirst(ClaimTypes.Email)?.Value
                     ?? principal.FindFirst("preferred_username")?.Value; // fallback
            var name = principal.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                throw new UnAuthorizedException("Invalid Microsoft Token: Email missing");
            }

            return new TokenResultDataDto
            {
                Email = email,
                Name = name
            };
        }


    }
}