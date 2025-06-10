using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Domain.Contracts;
using Services.Abstraction;
using Shared.DTOs.Doctor;
using Shared.DTOs.Patient;

namespace Services
{
    internal class ReviewService : IReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public ReviewService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task AddReview(AddReviewDTO review, int patientId, int doctorId)
        {
            var newReview = _mapper.Map<Domain.Models.Review>(review);
            newReview.PatientID = patientId;
            newReview.DoctorID = doctorId;
            await _unitOfWork.GetRepository<Domain.Models.Review, int>().AddAsync(newReview);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<int?> GetReviewByPatientAndDoctor(int patientId, int doctorId)
        {
            var specs = new SpecificationsBase<Domain.Models.Review>(r => r.PatientID == patientId && r.DoctorID == doctorId);
            var review = (await _unitOfWork.GetRepository<Domain.Models.Review, int>().GetAllAsync(specs)).FirstOrDefault();
            if (review == null)
                return null;
            return review.Id;
        }
        public async Task UpdateReview(ReviewDTO review)
        {
            var existingReview = await _unitOfWork.GetRepository<Domain.Models.Review, int>().GetByIdAsync(review.ID);
            if (existingReview == null)
                throw new Exception("Review not found");
            var updatedReview = _mapper.Map(review, existingReview);
            _unitOfWork.GetRepository<Domain.Models.Review, int>().Update(updatedReview);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<ReviewDTO> GetReviewByID(int reviewId)
        {
            var review = await _unitOfWork.GetRepository<Domain.Models.Review, int>().GetByIdAsync(reviewId);
            if (review == null)
                return null;
            return _mapper.Map<ReviewDTO>(review);
        }
        public async Task<ICollection<ReviewDTO>> GetDoctorReviews(int doctorId, int pageIndex = 1, int pageSize = 5)
        {
            SpecificationsBase<Domain.Models.Review> specifications = new SpecificationsBase<Domain.Models.Review>(x => x.DoctorID == doctorId);
            specifications.ApplyPagination(pageIndex, pageSize);
            specifications.AddInclude(r => r.Patient);
            var reviews = await _unitOfWork.GetRepository<Domain.Models.Review, int>().GetAllAsync(specifications);
            if (reviews.Count == 0)
                return new List<ReviewDTO>();
            return _mapper.Map<ICollection<ReviewDTO>>(reviews);
        }
        public async Task<float> GetDoctorAverageRating(int docId)
        {
            SpecificationsBase<Domain.Models.Review> specifications = new SpecificationsBase<Domain.Models.Review>(x => x.DoctorID == docId);
            var reviews = await _unitOfWork.GetRepository<Domain.Models.Review, int>().GetAllAsync(specifications);
            if (reviews.Count == 0)
                return 0;
            float totalRating = 0;
            foreach (var review in reviews)
                totalRating += review.Rate;
            return totalRating / reviews.Count;
        }
        public async Task<decimal> GetAvgRatings()
        {
            var reviews = await _unitOfWork.GetRepository<Domain.Models.Review, int>().GetAllAsync();
            if (reviews.Count == 0)
                return 0;
            decimal totalRating = 0;
            foreach (var review in reviews)
                totalRating += review.Rate;
            return totalRating / reviews.Count;
        }
        public async Task DeleteReview(int ReviewId)
        {
            var review = await _unitOfWork.GetRepository<Domain.Models.Review, int>().GetByIdAsync(ReviewId);
            if (review == null)
                return;
            _unitOfWork.GetRepository<Domain.Models.Review, int>().Delete(review);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
