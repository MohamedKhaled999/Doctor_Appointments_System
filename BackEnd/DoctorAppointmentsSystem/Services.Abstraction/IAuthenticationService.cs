﻿using Shared.Authentication;

namespace Services.Abstraction
{
    public interface IAuthenticationService
    {
        public Task<UserResultDto> LoginAsync(LoginDto loginDto);
        public Task<UserResultDto> RegisterAsync(RegisterDto registerDto);
        public Task<UserResultDto> GetUserByEmail(string email);
        public Task<bool> CheckEmailExist(string email);
        public Task<bool> ChangePasswordAsync(string email, string oldPassword, string newPassword);
        public Task<string> ForgetPasswordAsync(string email, string firstName, string lastName);
        public Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
    }
}
