import { schema } from "normalizr";

export const account = new schema.Entity("accounts");
export const member = new schema.Entity("members");
export const person = new schema.Entity("people");
export const client = new schema.Entity("clients");
export const teamMember = new schema.Entity("teamMembers");
export const phrase = new schema.Entity("phrases");

account.define({
  clients: [ client ],
  owner: member,
});

teamMember.define({
    member,
    client,
});

phrase.define({
    client,
});

client.define({
    account,
    phrases: [ phrase ],
    teamMembers: [ teamMember ],
});
