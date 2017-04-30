namespace Server.Model
{
    public class EventAttendeeVm
    {
        public int Id { get; set; }
        public UserVm User { get; set; }
        public EventVm Event { get; set; }
        public string Status { get; set; }
        public string Comment { get; set; }
    }
}