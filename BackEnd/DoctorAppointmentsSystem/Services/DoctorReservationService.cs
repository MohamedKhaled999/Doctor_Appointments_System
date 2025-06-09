using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Domain.Models.Enums;
using Services.Abstraction;
using Services.Specifications.DoctorReservation;
using Shared.DTOs.Appointment;
using Shared.DTOs.Doctor;
using Shared.DTOs.DoctorReservation;

namespace Services
{
    internal class DoctorReservationService : IDoctorReservationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public async Task<List<AppointmentDTO>?> GetAppointmentsByReservationId(int id)
        {
            var reservation = (await _unitOfWork.GetRepository<DoctorReservation, int>().GetAllAsync(new AppointmentReservationSpecifications(r => r.Id == id))).FirstOrDefault();
            if (reservation == null)
                throw new Exception("Reservation not found");
            return _mapper.Map<List<AppointmentDTO>?>(reservation.Appointments);
        }

        public async Task<DoctorFeesDTO> GetDoctorByReservationId(int id)
        {
            var reservation = (await _unitOfWork.GetRepository<DoctorReservation, int>().GetAllAsync(new DoctorReservationSpecifications(r => r.Id == id))).FirstOrDefault();
            if (reservation == null)
                throw new Exception("Reservation not found");
            return _mapper.Map<DoctorFeesDTO>(reservation.Doctor);
        }
        public DoctorReservationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task AddDoctorReservation(NewResDTO res)
        {
            DoctorReservation newReservation = _mapper.Map<DoctorReservation>(res);
            if (!IsInCalendar(newReservation).Result)
            {
                await _unitOfWork.GetRepository<DoctorReservation, int>().AddAsync(newReservation);
            }
            else
            {
                Console.WriteLine("Reservation Already Exist");
                var oldReservation = (await _unitOfWork.GetRepository<DoctorReservation, int>().GetAllAsync(new SpecificationsBase<DoctorReservation>(x => x.DoctorID == newReservation.DoctorID
                && x.StartTime.Day == newReservation.StartTime.Day
                && x.StartTime.Month == newReservation.StartTime.Month
                && x.StartTime.Year == newReservation.StartTime.Year))).FirstOrDefault();
                oldReservation.StartTime = newReservation.StartTime;
                oldReservation.EndTime = newReservation.EndTime;
                oldReservation.MaxReservation = newReservation.MaxReservation;
                _unitOfWork.GetRepository<DoctorReservation, int>().Update(oldReservation);
            }
            await _unitOfWork.SaveChangesAsync();

        }
        public async Task EditDoctorReservation(NewResDTO res)
        {
            var reservation = await _unitOfWork.GetRepository<DoctorReservation, int>().GetByIdAsync(res.ResID);
            if (reservation == null)
                throw new Exception("Reservation not found");
            _unitOfWork.GetRepository<DoctorReservation, int>().Update(_mapper.Map(res, reservation));
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task DeleteDoctorReservation(int resId)
        {
            var reservation = await _unitOfWork.GetRepository<DoctorReservation, int>().GetByIdAsync(resId);
            if (reservation == null)
                throw new Exception("Reservation not found");
            _unitOfWork.GetRepository<DoctorReservation, int>().Delete(reservation);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<DoctorReservationDTO> GetDoctorReservationByID(int id)
        {
            var reservation = await _unitOfWork.GetRepository<DoctorReservation, int>().GetByIdAsync(id);
            if (reservation == null)
                throw new Exception("Reservation not found");
            var reservationDTO = _mapper.Map<DoctorReservationDTO>(reservation);
            reservationDTO.IsAvailable = reservation.MaxReservation > _unitOfWork.GetRepository<Appointment, int>()
                .GetCount(new SpecificationsBase<Appointment>(x => x.DoctorReservationID == id));
            return reservationDTO;
        }
        public async Task<List<DoctorReservationDTO>> GetReservationsByDocID(int id)
        {
            var reservations = await _unitOfWork.GetRepository<DoctorReservation, int>()
                .GetAllAsync(new SpecificationsBase<DoctorReservation>(x => x.DoctorID == id && x.StartTime > DateTime.Now));
            if (reservations == null || reservations.Count == 0)
                throw new Exception("No reservations found for this doctor");
            var reservationDTOs = _mapper.Map<List<DoctorReservationDTO>>(reservations);
            int i = 0;
            foreach (var reservation in reservationDTOs)
            {
                reservation.IsAvailable = reservations[i].MaxReservation > _unitOfWork.GetRepository<Appointment, int>()
                    .GetCount(new SpecificationsBase<Appointment>(x => x.DoctorReservationID == reservations[i].Id));
                i++;
            }

            return reservationDTOs;
        }
        public async Task<DoctorReservationDTO?> GetLastReservationByDoctor(int doctorId)
        {
            var reservation = (await _unitOfWork.GetRepository<DoctorReservation, int>().GetAllAsync(new SpecificationsBase<DoctorReservation>(a => a.DoctorID == doctorId))).LastOrDefault();
            if (reservation == null)
                throw new ArgumentNullException($"Reservation doesn't exist");
            return _mapper.Map<DoctorReservationDTO>(reservation);
        }
        public async void GenerateCalendarReservation(int docId, int MaxRes)
        {
            var doc = await _unitOfWork.GetRepository<Doctor, int>().GetByIdAsync(docId);
            WorkingDays days = doc.WorkingDays;
            foreach (WorkingDays day in Enum.GetValues(typeof(WorkingDays)))
            {
                if ((days & day) == day)
                {
                    GenerateRecordDay(doc, day, MaxRes);
                }
            }

        }
        private void GenerateRecordDay(Doctor doc, WorkingDays day, int MaxRes)
        {
            DateTime date = GetCorrespondingNextDay(DateTime.Now, day);
            DateTime start = new DateTime(new DateOnly(date.Year, date.Month, date.Day)
                 , new TimeOnly(doc.DefaultStartTime.Hour, doc.DefaultStartTime.Minute));
            DateTime end = new DateTime(new DateOnly(date.Year, date.Month, date.Day)
                 , new TimeOnly(doc.DefaultEndTime.Hour, doc.DefaultEndTime.Minute));
            DoctorReservation newReservation = new DoctorReservation()
            {
                DoctorID = doc.Id,
                StartTime = start,
                EndTime = end,
                MaxReservation = MaxRes
            };
            if (!IsInCalendar(newReservation).Result)
            {
                _unitOfWork.GetRepository<DoctorReservation, int>().AddAsync(newReservation).Wait();
            }
            else
            {
                Console.WriteLine("Reservation Already Exist");
                _unitOfWork.GetRepository<DoctorReservation, int>().Update(newReservation);

            }
            _unitOfWork.SaveChangesAsync().Wait();

        }
        public static DateTime GetCorrespondingNextDay(DateTime date, WorkingDays day)
        {
            int dayValue = (int)day;
            int bitPosition = (int)Math.Log(dayValue, 2);
            // .NET DayOfWeek Enum Values sunday = 0 
            int desiredDayOfWeek = (bitPosition - 1 + 7) % 7;
            int currentDayOfWeek = (int)date.DayOfWeek;
            int daysToAdd = (desiredDayOfWeek - currentDayOfWeek + 7) % 7;
            if (daysToAdd == 0)
            {
                daysToAdd = 7;
            }
            return date.AddDays(daysToAdd);
        }
        private async Task<bool> IsInCalendar(DoctorReservation res)
        {
            // check this later for intersection between two reservations 
            return _unitOfWork.GetRepository<DoctorReservation, int>()
                .GetCount(new SpecificationsBase<DoctorReservation>(x => x.DoctorID == res.DoctorID
                && x.StartTime.Day == res.StartTime.Day
                && x.StartTime.Month == res.StartTime.Month
                && x.StartTime.Year == res.StartTime.Year)) > 0;
        }
    }
}
