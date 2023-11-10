using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToDoBackend.Api.Models
{
    public class ToDoItem
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; } = null;
        public bool IsCompleted { get; set; } = false;
        [Required]
        public string UserId { get; set; } = string.Empty;
        [ForeignKey("UserId")]
        public User User { get; set; } = new User();

        public void EliminateUserInfo()
        {
            User.PasswordHash = string.Empty;
            User.Email = string.Empty;
            User.SecurityStamp = string.Empty;
            User.ConcurrencyStamp = string.Empty;
        }
    }
}
