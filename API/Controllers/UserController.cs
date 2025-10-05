using System;
using System.Threading.Tasks;
using Core.Auth;
using Core.Dto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class UserController : BaseController
    {
        [HttpGet]
        public async Task<AppUserDto> GetCurrentUser()
        {
            return await SendToMediatorAndReturnUser(new CurrentUser.Query());
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AppUserDto>> Login(Login.Query query)
        {
            return await SendToMediatorAndReturnUser(query);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<Unit>> Register(Register.Command command)
        {
            command.Origin = Request.Headers["origin"];
            await Mediator.Send(command);
            return Ok("Registration successful - please check your email");
        }

        [HttpPost("refreshToken")]
        public async Task<ActionResult<AppUserDto>> GetRefreshToken(GetRefreshToken.Command command)
        {
            command.RefreshToken = Request.Cookies["refreshToken"];
            return await SendToMediatorAndReturnUser(command);
        }

        [AllowAnonymous]
        [HttpPost("verifyEmail")]
        public async Task<ActionResult> VerifyEmail(ConfirmEmail.Command command)
        {
            var result = await Mediator.Send(command);
            if (!result.Succeeded) return BadRequest("Problem verifying email address.");
            return Ok("Email confirmed - you can now login.");
        }

        [AllowAnonymous]
        [HttpGet("resendEmailVerification")]
        public async Task<ActionResult> ResendEmailVerification([FromQuery] ResendEmailVerification.Query query)
        {
            query.Origin = Request.Headers["origin"];
            await Mediator.Send(query);
            return Ok("Email verifications sent - Please check your email.");
        }

        private async Task<AppUserDto> SendToMediatorAndReturnUser<T>(T mediatorAction)
        {
            var user = await Mediator.Send(mediatorAction) as AppUserDto;
            SetRefreshTokenCookie(user.RefreshToken);
            return user;
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions()
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
