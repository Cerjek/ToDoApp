using ToDoBackend.Api.Models;

namespace ToDoBackend.Api.Services
{
    public interface IToDoItemService
    {
        Task<(int, string)> CreateToDoItem(ToDoItem item);
        Task<(int, List<ToDoItem>, string)> GetToDoItemList(string userId);
        Task<(int, string)> UpdateToDoItem(ToDoItem item);
        Task<(int, string)> DeleteToDoItem(string itemId);
        Task<(int, ToDoItem?, string)> GetToDoItem(string userId, string itemId);
    }
}
