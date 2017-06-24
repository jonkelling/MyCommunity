using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Core;
using Server.Model;
using Server.Services;

namespace Server.Controllers
{
    [ApiVersion("1.0")]
    [Authorize]
    [Route("api/v{version:apiVersion}/communities/{communityId}/[controller]")]
    public class FeedbackMessagesController : BaseController
    {
        public FeedbackMessagesController(IMyCommunityContext dbContext, IMapper mapper, IAuth0Service auth0Service) : base(dbContext, mapper, auth0Service)
        {
        }

        [HttpGet]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(
            int communityId,
            [FromQuery] DateTime? before = null,
            [FromQuery] DateTime? after = null,
            [FromQuery] int? limit = null)
        {
            var results = from feedbackMessage in _dbContext.FeedbackMessages.Include(feedbackMessage => feedbackMessage.User)
                          where feedbackMessage.User.CommunityId == communityId
                          select feedbackMessage;

            if (before.HasValue)
            {
                results = from feedbackMessage in results
                          where feedbackMessage.CreatedDateTime < before.Value.ToUniversalTime()
                          orderby feedbackMessage.CreatedDateTime descending
                          select feedbackMessage;
            }

            if (after.HasValue)
            {
                results = from feedbackMessage in results
                          where feedbackMessage.CreatedDateTime > after.Value.ToUniversalTime()
                          orderby feedbackMessage.CreatedDateTime ascending
                          select feedbackMessage;
            }

            if (limit.HasValue)
            {
                results = results.Take(limit.Value);
            }

            return Ok(_mapper.Map<IEnumerable<FeedbackMessageVm>>(await results.ToListAsync()));
        }

        [HttpGet("{feedbackMessageId}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(int communityId, int feedbackMessageId)
        {
            return Ok(_mapper.Map<FeedbackMessageVm>(await _dbContext.FeedbackMessages.FindAsync(feedbackMessageId)));
        }

        [HttpPost]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Post(int communityId, [FromBody]FeedbackMessageVm feedbackMessage)
        {
            var feedbackMessageEntity = _mapper.Map<FeedbackMessage>(feedbackMessage);
            feedbackMessageEntity.User = await _dbContext.Users.FindAsync(feedbackMessage.User.Id);
            await _dbContext.FeedbackMessages.AddAsync(feedbackMessageEntity);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new
            {
                CommunityId = communityId,
                FeedbackMessageId = feedbackMessageEntity.Id
            }, _mapper.Map<FeedbackMessageVm>(feedbackMessageEntity));
        }
    }
}
