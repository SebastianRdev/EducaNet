using System;

namespace EducaNet.Application.DTOs
{
    public class LessonDto
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateLessonDto
    {
        public Guid CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public int Order { get; set; }
    }

    public class UpdateLessonDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public int Order { get; set; }
    }
}
