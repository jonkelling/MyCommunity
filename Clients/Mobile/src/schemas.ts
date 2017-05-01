import { schema } from "../node_modules/normalizr/index";

export const user = new schema.Entity("users");
export const community = new schema.Entity("communities");
export const post = new schema.Entity("posts");
export const event = new schema.Entity("events");
export const eventAttendee = new schema.Entity("eventAttendees");

user.define({
    community,
});

community.define({
    users: [user],
});

post.define({
    author: user,
});

event.define({
    author: user,
    eventAttendees: [eventAttendee],
});

eventAttendee.define({
    user,
    event,
});

export const userList = new schema.Array(user);
export const communityList = new schema.Array(community);
export const postList = new schema.Array(post);
export const eventList = new schema.Array(event);
export const eventAttendeeList = new schema.Array(eventAttendee);
