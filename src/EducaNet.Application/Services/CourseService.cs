using EducaNet.Application.Interfaces;
using EducaNet.Application.DTOs;
using EducaNet.Domain.Entities;
using EducaNet.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EducaNet.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly IGenericRepository<Course> _repository;

        public CourseService(IGenericRepository<Course> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CourseSummaryDto>> SearchAsync(int page, string? status, string? search)
        {
            var query = _repository.GetQueryable().Include(c => c.Lessons).AsQueryable();

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<CourseStatus>(status, out var statusEnum))
            {
                query = query.Where(c => c.Status == statusEnum);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Title.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            var pageSize = 10;
            var courses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CourseSummaryDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Status = c.Status.ToString(),
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    LessonsCount = c.Lessons.Count,
                    LessonTitles = c.Lessons.OrderBy(l => l.Order).Select(l => l.Title).ToList()
                })
                .ToListAsync();

            return courses;
        }

        public async Task<CourseDto?> GetByIdAsync(Guid id)
        {
            var course = await _repository.GetQueryable()
                .Include(c => c.Lessons)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (course == null) return null;

            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = "Description placeholder",
                Status = course.Status.ToString(),
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                Lessons = course.Lessons?.Select(l => new LessonDto
                {
                    Id = l.Id,
                    CourseId = l.CourseId,
                    Title = l.Title,
                    Order = l.Order,
                    CreatedAt = l.CreatedAt
                }).ToList() ?? new List<LessonDto>()
            };
        }

        public async Task<CourseSummaryDto?> GetSummaryAsync(Guid id)
        {
            var course = await _repository.GetQueryable()
                .Include(c => c.Lessons)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (course == null) return null;

            return new CourseSummaryDto
            {
                Id = course.Id,
                Title = course.Title,
                Status = course.Status.ToString(),
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                LessonsCount = course.Lessons.Count,
                LessonTitles = course.Lessons.OrderBy(l => l.Order).Select(l => l.Title).ToList()
            };
        }

        public async Task<CourseDto> CreateAsync(CreateCourseDto dto)
        {
            var course = new Course
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Status = CourseStatus.Draft,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(course);

            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Status = course.Status.ToString(),
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                Lessons = new List<LessonDto>()
            };
        }

        public async Task UpdateAsync(Guid id, UpdateCourseDto dto)
        {
            var course = await _repository.GetByIdAsync(id);
            if (course == null) throw new KeyNotFoundException("Course not found");

            course.Title = dto.Title;
            course.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(course);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task PublishAsync(Guid id)
        {
            var course = await _repository.GetQueryable()
                .Include(c => c.Lessons)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (course == null) throw new KeyNotFoundException("Course not found");

            if (course.Lessons == null || !course.Lessons.Any(l => !l.IsDeleted))
            {
                throw new InvalidOperationException("Cannot publish a course with no active lessons.");
            }

            course.Status = CourseStatus.Published;
            course.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(course);
        }

        public async Task UnpublishAsync(Guid id)
        {
            var course = await _repository.GetQueryable()
                .Include(c => c.Lessons)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (course == null) throw new KeyNotFoundException("Course not found");

            course.Status = CourseStatus.Draft;
            course.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(course);
        }
    }
}
