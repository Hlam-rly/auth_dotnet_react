using Postgrest.Models;
using Postgrest.Attributes;

namespace Testic
{
  [Table("UserDetails")]
  public class UserDetails : BaseModel
  {
    [PrimaryKey("id", false)]
    public int Id { get; set; }
    
    [Column("uid")]
    public string Uid { get; set; }

    [Column("nickname")]
    public string Nickname { get; set; }

    [Column("image")]
    public string? Image { get; set; } = null;

    [Column("description")]
    public string? Description { get; set; } = null;
  }
}
