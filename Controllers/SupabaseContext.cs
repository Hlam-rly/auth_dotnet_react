using Supabase.Gotrue;
using Supabase.Storage;
using System.Net.Mime;

namespace Testic.Controllers
{
  public class SupabaseContext
  {
    private readonly Supabase.Client supabase;
    public SupabaseContext(Supabase.Client supabaseInput)
    {
      supabase = supabaseInput;
    }

    public async Task<Session?> SignUp(string emailInput, string passwordInput, SignUpOptions signUpOptions)
    { 
     return await supabase.Auth.SignUp(emailInput, passwordInput, signUpOptions);
    }

    public async Task<Session?> SignIn(string emailInput, string passwordInput)
    {
      var response = await supabase.Auth.SignInWithPassword(emailInput, passwordInput);

      return response;
    }
    public async Task<Session?> GetSession()
    {
      return await supabase.Auth.RetrieveSessionAsync();
    }

    public async Task<Dictionary<string, string>?> GetUser()
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

    public async Task<Dictionary<string, string>?> UpdateUserInfo(int id, string fieldName, string fieldValue)
    {
      await supabase.Rpc("UpdateUserInfo", new Dictionary<string, object> { { "fieldid", id }, { "fieldname", fieldName }, { "fieldvalue", fieldValue } });

      return await this.GetUser();
    }

    public async Task<string> UploadImage(byte[] file, string filePath)
    {

      Supabase.Storage.FileOptions options = new();

      options.CacheControl = "3600";
      options.Upsert = false;

      return await supabase.Storage.From("Image").Upload(file, filePath, options);
    }
  }
}
