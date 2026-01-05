using EducaNet.Application.Interfaces;
using EducaNet.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace EducaNet.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<ILessonService, LessonService>();
            return services;
        }
    }
}
