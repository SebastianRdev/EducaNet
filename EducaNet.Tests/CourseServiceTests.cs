using EducaNet.Application.Interfaces;
using EducaNet.Application.Services;
using EducaNet.Domain.Entities;
using EducaNet.Domain.Enums;
using Moq;
using MockQueryable.Moq;
using MockQueryable;
using System.Linq.Expressions;
using Xunit;

namespace EducaNet.Tests
{
    public class CourseServiceTests
    {
        private readonly Mock<IGenericRepository<Course>> _mockRepo;
        private readonly CourseService _service;

        public CourseServiceTests()
        {
            _mockRepo = new Mock<IGenericRepository<Course>>();
            _service = new CourseService(_mockRepo.Object);
        }

        [Fact]
        public async Task PublishCourse_WithLessons_ShouldSucceed()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var course = new Course 
            { 
                Id = courseId, 
                Title = "Test Course", 
                Status = CourseStatus.Draft,
                Lessons = new List<Lesson> 
                { 
                    new Lesson { Id = Guid.NewGuid(), CourseId = courseId, Title = "Lesson 1", Order = 1, IsDeleted = false } 
                }
            };

            var courses = new List<Course> { course }.AsQueryable().BuildMock();
            _mockRepo.Setup(r => r.GetQueryable()).Returns(courses);

            // Act
            await _service.PublishAsync(courseId);

            // Assert
            Assert.Equal(CourseStatus.Published, course.Status);
            _mockRepo.Verify(r => r.UpdateAsync(course), Times.Once);
        }

        [Fact]
        public async Task PublishCourse_WithoutLessons_ShouldFail()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var course = new Course 
            { 
                Id = courseId, 
                Title = "Empty Course", 
                Status = CourseStatus.Draft,
                Lessons = new List<Lesson>() 
            };
            
            var courses = new List<Course> { course }.AsQueryable().BuildMock();
            _mockRepo.Setup(r => r.GetQueryable()).Returns(courses);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.PublishAsync(courseId));
        }

        [Fact]
        public async Task DeleteCourse_ShouldBeSoftDelete()
        {
            // Arrange
            var courseId = Guid.NewGuid();

            // Act
            await _service.DeleteAsync(courseId);

            // Assert
            // In the service layer, we verify that the repository's DeleteAsync is called.
            // The actual soft delete logic (setting IsDeleted = true) is implemented in the GenericRepository.
            _mockRepo.Verify(r => r.DeleteAsync(courseId), Times.Once);
        }
    }
}
