using EducaNet.Application.Interfaces;
using EducaNet.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducaNet.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LessonsController : ControllerBase
    {
        private readonly ILessonService _lessonService;

        public LessonsController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourseId(Guid courseId)
        {
            var lessons = await _lessonService.GetByCourseIdAsync(courseId);
            return Ok(lessons);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLessonDto dto)
        {
            try
            {
                var lesson = await _lessonService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetByCourseId), new { courseId = lesson.CourseId }, lesson);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLessonDto dto)
        {
            try
            {
                await _lessonService.UpdateAsync(id, dto);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _lessonService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/reorder")]
        public async Task<IActionResult> Reorder(Guid id, [FromBody] int newOrder)
        {
            try
            {
                await _lessonService.ReorderAsync(id, newOrder);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
