--update dbo.Posts set [AuthorId] = 4 where [Headline] like 'Test%';

--delete from dbo.Posts where [Headline] like 'Test%' and [Headline] like '%8';

--update dbo.Users set [CommunityId] = 2 where [Email] = 'jonkelling+appletest2@gmail.com';

select Id, ExpireDateTime, CreatedDateTime from dbo.Posts where [AuthorId] = 1 and Id > 72;
