using System;
using System.Collections.Generic;

namespace Server.Model
{
    public class EventVm : PostVm
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Location { get; set; }
        public IEnumerable<EventAttendeeVm> EventAttendees { get; set; }
    }
}