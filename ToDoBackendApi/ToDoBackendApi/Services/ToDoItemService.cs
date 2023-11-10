using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ToDoBackend.Api.Models;

namespace ToDoBackend.Api.Services
{
    public class ToDoItemService : IToDoItemService
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;

        public ToDoItemService(ApplicationDbContext context, UserManager<User> userManager) 
        {
            _context = context;
            _userManager = userManager; 
        }

        public async Task<(int, string)> CreateToDoItem(ToDoItem item)
        {
            if(item == null || item.UserId.IsNullOrEmpty())
            {
                return (0, "Invalid User.");
            }

            var user = await _userManager.FindByIdAsync(item.UserId);

            if (user == null)
            {
                return (0, "User not found");
            }

            item.User = user;

            if (item.Name.IsNullOrEmpty())
            {
                return (0, "Item must have a valid name.");
            }

            _context.ToDoItems.Add(item);
            var result = await _context.SaveChangesAsync();

            if (result == 0)
            {
                return (0, "Failed to create the To Do Item.");
            }

            return (1, $"{item.Name} successfully created.");
        }

        public async Task<(int, string)> DeleteToDoItem(string itemId)
        {
            if(itemId.IsNullOrEmpty())
            {
                return (0, "Invalid Item id.");
            }

            var itemExists = await _context.ToDoItems.FindAsync(new Guid(itemId));

            if (itemExists == null)
                return (StatusCodes.Status404NotFound, "Item not found.");

            _context.ToDoItems.Remove(itemExists);
            var result = await _context.SaveChangesAsync();

            if (result == 0)
            {
                return (0, "Failed to remove the To Do Item.");
            }

            return (1, $"{itemExists.Name} successfully removed.");
        }

        public async Task<(int, List<ToDoItem>, string)> GetToDoItemList(string userId)
        {
            if (userId.IsNullOrEmpty())
            {
                return (0, new List<ToDoItem>(), "Invalid User id.");
            }

            var itemList = await _context.ToDoItems.Where(item => item.UserId == userId).ToListAsync();

            if (itemList == null)
                return (0, new List<ToDoItem>(), "Issue retrieving item list.");

            return (1, itemList, "List retrieved");
        }

        public async Task<(int, ToDoItem?, string)> GetToDoItem(string userId, string itemId)
        {
            if (userId.IsNullOrEmpty())
            {
                return (0, null, "Invalid User id.");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return (0, null, "User not found");
            }

            if (itemId.IsNullOrEmpty())
            {
                return (0, null, "Invalid Item id.");
            }

            var item = await _context.ToDoItems.FindAsync(new Guid(itemId));

            if (item == null)
                return (StatusCodes.Status404NotFound, null, "Item not found.");

            item.EliminateUserInfo();
            return (1, item, $"Item {item.Name} retrieved.");
        }

        public async Task<(int, string)> UpdateToDoItem(ToDoItem item)
        {
            if (item.UserId.IsNullOrEmpty())
            {
                return (0, "Invalid User id.");
            }

            if (item.Name.IsNullOrEmpty())
            {
                return (0, "Invalid Item name.");
            }

            var itemExists = await _context.ToDoItems.FindAsync(item.Id);

            if (itemExists == null)
                return (StatusCodes.Status404NotFound, "Item not found.");

            itemExists.DueDate = item.DueDate;
            itemExists.Description = item.Description;
            itemExists.IsCompleted = item.IsCompleted;
            itemExists.Name = item.Name;

            var result = await _context.SaveChangesAsync();

            if (result == 0)
            {
                return (0, "Failed to update the To Do Item.");
            }

            return (1, $"{item.Name} successfully updated.");
        }
    }

}