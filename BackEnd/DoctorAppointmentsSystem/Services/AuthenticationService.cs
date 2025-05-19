﻿using Domain.Models;
using Infrastructure.Services.EmailService;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Shared.DTOs.Email;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Services
{
    public class AuthenticationService(UserManager<AppUser> _userManager, IOptions<JwtOptions> options, IEmailService _emailService) : IAuthenticationService
    {
        public async Task<bool> CheckEmailExist(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user != null;
        }

        public async Task<UserResultDto> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email) ?? throw new Exception($"Email ({email}) Not Found!");
            return new UserResultDto($"{user.FirstName} {user.LastName}", user.Email, await CreateTokenAsync(user));
        }

        public async Task<UserResultDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) throw new Exception("Invalid Email !!");

            if (!user.EmailConfirmed) throw new Exception("Email Not Confirmed");

            var Result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (Result == false) throw new Exception("Invalid Password !!");

            return new UserResultDto
            (
                Email: user.Email,
                DisplayName: $"{user.FirstName} {user.LastName}",
                Token: await CreateTokenAsync(user)
            );
        }

        public async Task<UserResultDto> RegisterAsync(RegisterDto registerDto)
        {
            var user = new AppUser
            {
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                BirthDate = registerDto.BirthDate,
                Gender = registerDto.Gender,
                UserName = registerDto.Email,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description).ToList());
                throw new Exception($"Errors: {errors}");
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
            var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
            _emailService.SendEmail(new EmailDTO
            {
                To = registerDto.Email,
                Subject = "Confirm Your Email",
                Link = $"https://cima-zeta.vercel.app/confirm-success?email={registerDto.Email}&token={codeEncoded}",
                Template = MailTemplates.ConfirmEmailTemplate
            }, $"{registerDto.FirstName} {registerDto.LastName}");

            return new UserResultDto(
                    $"{registerDto.FirstName} {registerDto.LastName}",
                    user.Email,
                    Token: await CreateTokenAsync(user)
                );
        }

        private async Task<string> CreateTokenAsync(AppUser user)
        {
            var jwtOptions = options.Value;
            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new(ClaimTypes.Email, user.Email),
            };

            var Roles = await _userManager.GetRolesAsync(user);
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
            var user = await _userManager.FindByEmailAsync(email) ?? throw new Exception("User Not Found!");
            var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            if (!result.Succeeded)
                throw new Exception("Failed to Change Password!");
            return result.Succeeded;
        }

        public async Task<string> ForgetPasswordAsync(string email, string firstName, string lastName)
        {
            var user = await _userManager.FindByEmailAsync(email) ?? throw new Exception("User Not Found!");
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(token);
            var codeEncoded = WebEncoders.Base64UrlEncode(tokenGeneratedBytes);
            _emailService.SendEmail(new EmailDTO
            {
                To = email,
                Subject = "Reset Password",
                Link = $"https://cima-zeta.vercel.app/reset-password?email={email}&token={codeEncoded}",
                Template = MailTemplates.ForgotPasswordTemplate
            }, $"{firstName} {lastName}");
            if (token == null)
                throw new Exception("Failed to Generate Reset Password Token!");
            return token;
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email) ?? throw new Exception("User Not Found!");
            var codeDecodedBytes = WebEncoders.Base64UrlDecode(token);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);
            var result = await _userManager.ResetPasswordAsync(user, codeDecoded, newPassword);
            if (!result.Succeeded)
                throw new Exception("Failed to Reset Password!");
            return result.Succeeded;
        }
    }
}