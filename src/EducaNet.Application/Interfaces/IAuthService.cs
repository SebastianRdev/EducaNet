using EducaNet.Application.DTOs;
using System.Threading.Tasks;

namespace EducaNet.Application.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterAsync(RegisterDto dto);
        Task<(bool Success, string Token, string Email)> LoginAsync(LoginDto dto);
    }
}
