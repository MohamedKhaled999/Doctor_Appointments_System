using Shared.DTOs.Doctor;
using Shared.DTOs.Patient;
using System.Linq.Expressions;

namespace Services.Abstraction
{
    public interface IReviewService
    {
        Task AddReview(AddReviewDTO review);
        Task DeleteReview(int ReviewId);
        Task UpdateReview(ReviewDTO review);
        Task<ReviewDTO> GetReviewByID(int id);
        Task<ICollection<ReviewDTO>> GetDoctorReviews(int doctorId, int pageIndex = 1, int pageSize = 5);
        Task<float> GetDoctorAverageRating(int docId);
    }
}
