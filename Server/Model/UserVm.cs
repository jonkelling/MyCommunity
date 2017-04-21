namespace Server.Model
{
    public class UserVm
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? CommunityId { get; set; }
    }
}