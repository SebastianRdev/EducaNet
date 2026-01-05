using EducaNet.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EducaNet.Application.Interfaces
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseSummaryDto>> SearchAsync(int page, string? status, string? search);
        Task<CourseDto?> GetByIdAsync(Guid id);
        Task<CourseSummaryDto?> GetSummaryAsync(Guid id);
        Task<CourseDto> CreateAsync(CreateCourseDto dto);
        Task UpdateAsync(Guid id, UpdateCourseDto dto);
        Task DeleteAsync(Guid id);
        Task PublishAsync(Guid id);
        Task UnpublishAsync(Guid id);
    }
}
