namespace Server.Core
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Community Community { get; set; }
        public UserRole UserRole { get; set; }
    }
}