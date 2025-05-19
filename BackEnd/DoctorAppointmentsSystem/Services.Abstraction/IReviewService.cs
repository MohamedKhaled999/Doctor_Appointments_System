using System.Linq.Expressions;

namespace Services.Abstraction
{
    public interface IReviewService
    {
        void AddReview(Review review);
        void DeleteReview(Review review);
        void UpdateReview(Review review);
        Task<ICollection<Review>> GetAllReviews();
        Task<Review> GetReviewByID(int id);
        Task<ICollection<Review>> GetDoctorReviews(int doctorId);
        Task<float> GetDoctorAverageRating(int docId);
        public Task<List<Review>?> GetByCondition(Expression<Func<Review, bool>> conditionExpression);
    }
}
