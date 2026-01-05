using EducaNet.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EducaNet.Application.Interfaces
{
    public interface ILessonService
    {
        Task<IEnumerable<LessonDto>> GetByCourseIdAsync(Guid courseId);
        Task<LessonDto> CreateAsync(CreateLessonDto dto);
        Task UpdateAsync(Guid id, UpdateLessonDto dto);
        Task DeleteAsync(Guid id);
        Task ReorderAsync(Guid id, int newOrder);
    }
}
