using Microsoft.AspNetCore.Mvc;
using Eduride_Log.Logger;
using Eduride_Log.Models;
namespace Eduride_Log.Controllers
{
    [ApiController]
    [Route("api/logs")]
    public class LogController : ControllerBase
    {
        [HttpPost]
        public IActionResult Log([FromBody] LogRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Message))
                return BadRequest();

            string formattedMessage =
                $"[{request.Level}] [{request.Source}] {request.Message} | Data: {request.Data}";

            FileLogger.CurrentLogger.Log(formattedMessage);

            return Ok();
        }
    }
}
