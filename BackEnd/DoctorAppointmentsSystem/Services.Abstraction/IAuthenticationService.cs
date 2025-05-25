using Shared.Authentication;
using Shared.DTOs.Account;

namespace Services.Abstraction
{
    public interface IAuthenticationService
    {
        public Task<UserResultDto> LoginAsync(LoginDto loginDto);
        public Task<UserResultDto> RegisterAsync(RegisterDto registerDto);
        public Task<UserResultDto> GetUserByEmail(string email);
        public Task<bool> CheckEmailExist(string email);
        public Task<bool> ChangePasswordAsync(ChangePasswordDto changePasswordDto);
        public Task<string> ForgetPasswordAsync(ForgotPasswordDto  forgetPasswordDto);
        public Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
        public Task<bool> ConfirmEmailAsync(ConfirmEmailDto confirmEmailDto);
    }
}
