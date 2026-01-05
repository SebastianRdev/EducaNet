using EducaNet.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace EducaNet.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Course> Courses { get; }
        DbSet<Lesson> Lessons { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
