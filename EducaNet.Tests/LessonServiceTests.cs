using EducaNet.Application.Interfaces;
using EducaNet.Application.Services;
using EducaNet.Application.DTOs;
using EducaNet.Domain.Entities;
using Moq;
using System.Linq.Expressions;
using Xunit;

namespace EducaNet.Tests
{
    public class LessonServiceTests
    {
        private readonly Mock<IGenericRepository<Lesson>> _mockLessonRepo;
        private readonly Mock<IGenericRepository<Course>> _mockCourseRepo;
        private readonly LessonService _service;

        public LessonServiceTests()
        {
            _mockLessonRepo = new Mock<IGenericRepository<Lesson>>();
            _mockCourseRepo = new Mock<IGenericRepository<Course>>();
            _service = new LessonService(_mockLessonRepo.Object, _mockCourseRepo.Object);
        }

        [Fact]
        public async Task CreateLesson_WithUniqueOrder_ShouldSucceed()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var dto = new CreateLessonDto { CourseId = courseId, Title = "New Lesson", Order = 1 };
            
            _mockCourseRepo.Setup(r => r.GetByIdAsync(courseId)).ReturnsAsync(new Course { Id = courseId });
            _mockLessonRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Lesson, bool>>>()))
                .ReturnsAsync(new List<Lesson>()); // No existing lessons with same order

            // Act
            var result = await _service.CreateAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Title, result.Title);
            _mockLessonRepo.Verify(r => r.AddAsync(It.IsAny<Lesson>()), Times.Once);
        }

        [Fact]
        public async Task CreateLesson_WithDuplicateOrder_ShouldFail()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var dto = new CreateLessonDto { CourseId = courseId, Title = "Duplicate Lesson", Order = 1 };
            
            _mockCourseRepo.Setup(r => r.GetByIdAsync(courseId)).ReturnsAsync(new Course { Id = courseId });
            _mockLessonRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Lesson, bool>>>()))
                .ReturnsAsync(new List<Lesson> { new Lesson { Id = Guid.NewGuid(), CourseId = courseId, Order = 1 } });

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateAsync(dto));
        }

        [Fact]
        public async Task UpdateLesson_WithDuplicateOrder_ShouldFail()
        {
            // Arrange
            var lessonId = Guid.NewGuid();
            var courseId = Guid.NewGuid();
            var lesson = new Lesson { Id = lessonId, CourseId = courseId, Title = "Old Title", Order = 1 };
            var dto = new UpdateLessonDto { Title = "New Title", Order = 2 };

            _mockLessonRepo.Setup(r => r.GetByIdAsync(lessonId)).ReturnsAsync(lesson);
            _mockLessonRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Lesson, bool>>>()))
                .ReturnsAsync(new List<Lesson> { new Lesson { Id = Guid.NewGuid(), CourseId = courseId, Order = 2 } });

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.UpdateAsync(lessonId, dto));
        }
    }
}
