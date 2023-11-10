using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoBackend.Api.Models;
using ToDoBackend.Api.Services;

namespace ToDoBackend.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public class ToDoItemController : ControllerBase
    {
        private readonly IToDoItemService _toDoItemService;
        private readonly ILogger<ToDoItemController> _logger;

        public ToDoItemController(IToDoItemService toDoItemService, ILogger<ToDoItemController> logger)
        {
            _toDoItemService = toDoItemService;
            _logger = logger;
        }

        // GET: api/<ToDoItemController>/A257DBC0-747D-43A9-A347-A2BDA3C4588D/GetItems
        [HttpGet("{userId}/GetItems")]
        public async Task<IActionResult> GetToDoItemList(string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("InvalidPayload");

                var (status, itemList, message) = await _toDoItemService.GetToDoItemList(userId);

                if (status == 0)
                    return BadRequest(message);
                return Ok(itemList);
            }
            catch (Exception ex)
            {
                return ErrorBadRequest(ex.Message);
            }
        }

        [HttpGet("{userId}/GetItem/{itemId}")]
        public async Task<IActionResult> GetToDoItem(string userId, string itemId)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("InvalidPayload");

                var (status, item, message) = await _toDoItemService.GetToDoItem(userId, itemId);

                if (status == 0)
                    return BadRequest(message);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return ErrorBadRequest(ex.Message);
            }
        }

        // POST api/<ToDoItemController>
        [HttpPost]
        public async Task<IActionResult> CreateToDoItem([FromBody] ToDoItem item)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("InvalidPayload");
                var (status, message) = await _toDoItemService.CreateToDoItem(item);
                if (status == 0)
                    return BadRequest(message);
                return Ok(message);
            }
            catch (Exception ex)
            {
                return ErrorBadRequest(ex.Message);
            }
        }

        // PUT api/<ToDoItemController>/
        [HttpPut]
        public async Task<IActionResult> UpdateToDoItem([FromBody] ToDoItem item)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("InvalidPayload");
                var (status, message) = await _toDoItemService.UpdateToDoItem(item);
                if (status == StatusCodes.Status404NotFound)
                {
                    return NotFound(message);
                }
                if (status == 0)
                    return BadRequest(message);
                return Ok(message);
            }
            catch (Exception ex)
            {
                return ErrorBadRequest(ex.Message);
            }
        }

        // DELETE api/<ToDoItemController>/A257DBC0-747D-43A9-A347-A2BDA3C4588D
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("InvalidPayload");
                var (status, message) = await _toDoItemService.DeleteToDoItem(id);
                if (status == StatusCodes.Status404NotFound)
                {
                    return NotFound(message);
                }

                if (status == 0)
                    return BadRequest(message);
                return Ok();
            }
            catch (Exception ex)
            {
                return ErrorBadRequest(ex.Message);
            }
        }

        private ObjectResult ErrorBadRequest(string message)
        {
            _logger.LogError(message);
            return StatusCode(StatusCodes.Status500InternalServerError, message);
        }
    }
}
