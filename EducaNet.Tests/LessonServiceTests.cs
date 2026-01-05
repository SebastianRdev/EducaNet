using EducaNet.Application.DTOs;
using EducaNet.Application.Services;
using EducaNet.Application.Interfaces;
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
            var course = new Course { Id = courseId, Title = "Course 1" };
            var dto = new CreateLessonDto { CourseId = courseId, Title = "Lesson 1", Order = 1 };

            _mockCourseRepo.Setup(r => r.GetByIdAsync(courseId)).ReturnsAsync(course);
            _mockLessonRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Lesson, bool>>>()))
                .ReturnsAsync(new List<Lesson>()); // No existing lessons with same order

            // Act
            var result = await _service.CreateAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Order);
            _mockLessonRepo.Verify(r => r.AddAsync(It.IsAny<Lesson>()), Times.Once);
        }

        [Fact]
        public async Task CreateLesson_WithDuplicateOrder_ShouldFail()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var course = new Course { Id = courseId, Title = "Course 1" };
            var dto = new CreateLessonDto { CourseId = courseId, Title = "Duplicate Order", Order = 1 };

            _mockCourseRepo.Setup(r => r.GetByIdAsync(courseId)).ReturnsAsync(course);
            
            // Simulate existing lesson with same order
            _mockLessonRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Lesson, bool>>>()))
                .ReturnsAsync(new List<Lesson> { new Lesson { Id = Guid.NewGuid(), Order = 1 } });

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateAsync(dto));
        }
    }
}
