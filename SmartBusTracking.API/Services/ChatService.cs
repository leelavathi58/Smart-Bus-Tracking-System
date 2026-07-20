using System.Net.Http;
using System.Text;
using System.Text.Json;
using static System.Net.WebRequestMethods;

namespace SmartBusTracking.API.Services
{
    public class ChatService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public ChatService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> AskGeminiAsync(string userMessage)
        {
            try
            {
                var apiKey = _configuration["Gemini:ApiKey"];

                if (string.IsNullOrEmpty(apiKey))
                    throw new Exception("Gemini API Key not configured.");

                var url =
           $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={apiKey}";
                var requestBody = new
                {
                    systemInstruction = new
                    {
                        parts = new[]
                        {
                            new
                            {
                                text =
                                "You are a helpful assistant for a Smart Bus Tracking System web app. You help users with HOW TO USE the app — tracking buses, navigating pages, login, profile settings, changing passwords, understanding features. You do NOT have access to real-time data (you don't know actual bus locations, which buses are running, or specific trip statuses right now). If a user asks about a SPECIFIC bus's current location, ETA, or live status, do NOT guess or make up an answer — instead tell them to use the 'Track Bus' page to see real-time information. Keep all answers short, 2-3 sentences maximum."
                            }
                        }
                    },

                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new
                                {
                                    text = userMessage
                                }
                            }
                        }
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);

                var content = new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();

                    throw new Exception(error);
                }

                var responseJson = await response.Content.ReadAsStringAsync();

                using var document = JsonDocument.Parse(responseJson);

                var reply =
                    document.RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();

                return reply ?? "Sorry, I couldn't generate a response.";
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        }
    }
