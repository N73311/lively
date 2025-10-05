using System;
using System.Text;
using System.Threading.Tasks;
using Amazon;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Core.Interfaces;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.EmailContact
{
    public class AwsSesEmailSender : IEmailSender
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AwsSesEmailSender> _logger;
        private readonly AmazonSimpleEmailServiceClient _sesClient;
        private readonly string _fromEmail;

        public AwsSesEmailSender(
            UserManager<AppUser> userManager,
            IConfiguration configuration,
            ILogger<AwsSesEmailSender> logger)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;

            // Use IAM role credentials when running in container/EC2
            var region = RegionEndpoint.GetBySystemName(
                Environment.GetEnvironmentVariable("AWS_REGION") ?? "us-east-1"
            );
            _sesClient = new AmazonSimpleEmailServiceClient(region);

            _fromEmail = Environment.GetEnvironmentVariable("EMAIL_FROM")
                ?? "Lively <lively@zachayers.io>";
        }

        public async Task SendEmailAsync(string userEmail, string emailSubject, string message)
        {
            try
            {
                var sendRequest = new SendEmailRequest
                {
                    Source = _fromEmail,
                    Destination = new Destination
                    {
                        ToAddresses = new System.Collections.Generic.List<string> { userEmail }
                    },
                    Message = new Message
                    {
                        Subject = new Content(emailSubject),
                        Body = new Body
                        {
                            Html = new Content
                            {
                                Charset = "UTF-8",
                                Data = message
                            },
                            Text = new Content
                            {
                                Charset = "UTF-8",
                                Data = message.Replace("<p>", "").Replace("</p>", "\n")
                                    .Replace("<a href='", "").Replace("'>Click To Verify</a>", "")
                            }
                        }
                    }
                };

                var response = await _sesClient.SendEmailAsync(sendRequest);
                _logger.LogInformation($"Email sent successfully to {userEmail}. MessageId: {response.MessageId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {userEmail}");

                // In production, you might want to throw this error
                // For demo purposes, we'll log it but continue
                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
                {
                    throw new Exception($"Email could not be sent: {ex.Message}");
                }
            }
        }

        public async Task ConstructEmailAndSendAsync(AppUser user, IEmailVerificationRequest request)
        {
            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var queryToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));
            var verifyEmailUrl = $"{request.Origin}/user/verifyEmail?token={queryToken}&email={request.Email}";
            var emailHtml =
                $"<p>Please click the link below to verify your email address:</p><a href='{verifyEmailUrl}'>Click To Verify</a>";

            await SendEmailAsync(request.Email, "Lively - Verify Email Address", emailHtml);
        }
    }
}