using Microsoft.EntityFrameworkCore;

namespace ToDoBackend.Api.Models
{
    public class ToDoDbContext : DbContext
    {
        public DbSet<ToDoItem> ToDoItems { get; set; }

        public ToDoDbContext(DbContextOptions options) : base(options) { }
    }
}
