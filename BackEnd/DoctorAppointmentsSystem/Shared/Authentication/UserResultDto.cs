namespace Shared.Authentication
{
    public record UserResultDto(
        string Email,
        string DisplayName,
        string Role,
        string Token
        );

}
