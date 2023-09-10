using DotNetReact;
using Microsoft.AspNetCore.Mvc;
using Supabase.Gotrue;
using Testic;

var root = Directory.GetCurrentDirectory();
var dotenv = Path.Combine(root, "ClientApp/.env");
DotEnv.Load(dotenv);

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Url and Key to Supabase
var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
var key = Environment.GetEnvironmentVariable("SUPABASE_ANON_KEY");

// Connection to Supabase
var clientOptions = new Supabase.SupabaseOptions
{
  AutoRefreshToken = false,
  AutoConnectRealtime = true
};

Supabase.Client supabase = new Supabase.Client(url, key, clientOptions);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
  // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
  app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

// Method returns currently sign in user
async Task<Dictionary<string, string>>  GetUser()
{
  var user = await supabase.From<UserDetails>().Get();

  var fixedUser = new Dictionary<string, string>()
  {
    { "id", user.Model?.Id.ToString() ?? "" },
    { "nickname", user.Model?.Nickname ?? ""},
    { "description", user.Model?.Description ?? ""},
    { "image", user.Model?.Image ?? ""},
  };

  return fixedUser;
}

// Sign up API for creating new users
// Returns:

// Session Valid: "" 

// Session Invalid: Error
app.MapPost("/signup", async ([FromBody] SignUpRequest request) =>
{
  SignUpOptions signUpOptions = new()
  {
    Data = new Dictionary<string, object>() { { "nickname", request.nicknameInput } }
  };

  var session = await supabase.Auth.SignUp(request.emailInput, request.passwordInput, signUpOptions);

  return Results.Ok(session);
});

// Sign in API for logging in the users
// Returns:

// Session Valid: User 

// Session Invalid: ""
app.MapPost("/signin", async ([FromBody] SignInRequest request) =>
{
  var session = await supabase.Auth.SignIn(request.emailInput, request.passwordInput);

  if (session != null)
  {
    var user = await GetUser();

    return Results.Ok(user);
  }

  return Results.Ok("");
});

// Sign out API for logging out the users

app.MapPost("/signout", async () =>
{
    await supabase.Auth.SignOut();
    return Results.Ok();
});

// Check the validity of the current session

// Returns:

// Session Valid: User 

// Session Invalid: ""
app.MapGet("/session", async () =>
{
  var session = await supabase.Auth.RetrieveSessionAsync();

  if (session != null)
  {
    var user = await GetUser();

    return Results.Ok(user);
  }

  return Results.Ok("");
});

// API for updating user info (Nickname, Description/About me)

// Returns:
// Session Valid: User (with updated info) 

// Session Invalid: ""
app.MapPost("/session/user/update/info", async ([FromBody] UpdateUserInfoRequest request) =>
{
  var session = await supabase.Auth.RetrieveSessionAsync();

  if (session != null)
  {
    await supabase.Rpc("UpdateUserInfo", new Dictionary<string, object> { { "fieldid", request.id }, { "fieldname", request.fieldName }, { "fieldvalue", request.fieldValue } });

    var user = await GetUser();

    return Results.Ok(user);
  }

  return Results.Unauthorized();
});

//app.MapPost("/session/user/update/image", async ([FromBody] UploadImageRequest request, Supabase.Client supabase) =>
//{
//  byte[] a = Convert.FromBase64String(request.file);

//  var image = await supabase.Storage.From("Images").Upload(a, request.filePath);

//  return Results.Ok(image);
//});

app.Run();
record SignUpRequest(string emailInput, string passwordInput, string nicknameInput);
record SignInRequest(string emailInput, string passwordInput);
record UpdateUserInfoRequest(int id, string fieldName, string fieldValue);
record VerifyEmailRequest(string refreshToken);