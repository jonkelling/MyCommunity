import { schema } from "normalizr";

export const user = new schema.Entity("users");
export const community = new schema.Entity("communities");

user.define({
  community,
});

community.define({
    users: [ user ],
});

export const userList = new schema.Array(user);
export const communityList = new schema.Array(community);
