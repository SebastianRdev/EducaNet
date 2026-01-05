using EducaNet.Application.Interfaces;
using EducaNet.Application.DTOs;
using EducaNet.Domain.Entities;

namespace EducaNet.Application.Services
{
    public class LessonService : ILessonService
    {
        private readonly IGenericRepository<Lesson> _repository;
        private readonly IGenericRepository<Course> _courseRepository;

        public LessonService(IGenericRepository<Lesson> repository, IGenericRepository<Course> courseRepository)
        {
            _repository = repository;
            _courseRepository = courseRepository;
        }

        public async Task<IEnumerable<LessonDto>> GetByCourseIdAsync(Guid courseId)
        {
            var lessons = await _repository.FindAsync(l => l.CourseId == courseId);
            return lessons.OrderBy(l => l.Order).Select(l => new LessonDto
            {
                Id = l.Id,
                CourseId = l.CourseId,
                Title = l.Title,
                Order = l.Order,
                CreatedAt = l.CreatedAt
            });
        }

        public async Task<LessonDto> CreateAsync(CreateLessonDto dto)
        {
            var course = await _courseRepository.GetByIdAsync(dto.CourseId);
            if (course == null) throw new KeyNotFoundException("Course not found");

            // Check for unique order
            var existingLessons = await _repository.FindAsync(l => l.CourseId == dto.CourseId && l.Order == dto.Order);
            if (existingLessons.Any())
            {
                throw new InvalidOperationException("A lesson with this order already exists in the course.");
            }

            var lesson = new Lesson
            {
                Id = Guid.NewGuid(),
                CourseId = dto.CourseId,
                Title = dto.Title,
                Order = dto.Order,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(lesson);

            return new LessonDto
            {
                Id = lesson.Id,
                CourseId = lesson.CourseId,
                Title = lesson.Title,
                Order = lesson.Order,
                CreatedAt = lesson.CreatedAt
            };
        }

        public async Task UpdateAsync(Guid id, UpdateLessonDto dto)
        {
            var lesson = await _repository.GetByIdAsync(id);
            if (lesson == null) throw new KeyNotFoundException("Lesson not found");

            if (lesson.Order != dto.Order)
            {
                var existingLessons = await _repository.FindAsync(l => l.CourseId == lesson.CourseId && l.Order == dto.Order && l.Id != id);
                if (existingLessons.Any())
                {
                    throw new InvalidOperationException("A lesson with this order already exists in the course.");
                }
            }

            lesson.Title = dto.Title;
            lesson.Order = dto.Order;
            lesson.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(lesson);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task ReorderAsync(Guid id, int newOrder)
        {
            var lesson = await _repository.GetByIdAsync(id);
            if (lesson == null) throw new KeyNotFoundException("Lesson not found");

            if (lesson.Order != newOrder)
            {
                var existingLessons = await _repository.FindAsync(l => l.CourseId == lesson.CourseId && l.Order == newOrder && l.Id != id);
                if (existingLessons.Any())
                {
                    throw new InvalidOperationException("A lesson with this order already exists in the course.");
                }
            }

            lesson.Order = newOrder;
            lesson.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(lesson);
        }
    }
}
