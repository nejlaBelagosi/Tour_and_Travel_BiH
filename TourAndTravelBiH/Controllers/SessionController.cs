// Controllers/SessionController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TourAndTravelBiH.Models;

[Route("api/[controller]")]
[ApiController]
public class SessionController : ControllerBase
{
    private readonly DbTourAndTravelBiHContext _context;

    public SessionController(DbTourAndTravelBiHContext context)
    {
        _context = context;
    }

    [HttpPost("StartSession")]
    public async Task<IActionResult> StartSession([FromBody] int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        var session = new Session
        {
            UserId = userId,
            StartTime = DateTime.UtcNow,
            EndTime = DateTime.UtcNow,
            PageViews = 0,
            Engagements = 0
        };

        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(session.Id);
    }

    [HttpPost("EndSession")]
    public async Task<IActionResult> EndSession([FromBody] int sessionId)
    {
        var session = await _context.Sessions.FindAsync(sessionId);
        if (session == null)
        {
            return NotFound();
        }

        session.EndTime = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("GetSessions")]
    public async Task<IActionResult> GetSessions()
    {
        var sessions = await _context.Sessions.ToListAsync();
        return Ok(sessions);
    }

    [HttpGet("GetSessionCounts")]
    public async Task<IActionResult> GetSessionCounts()
    {
        try
        {
            var sessions = await _context.Sessions
                .GroupBy(s => s.StartTime.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return Ok(sessions);
        }
        catch (Exception ex)
        {
            // Log the exception (using a logging framework)
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
