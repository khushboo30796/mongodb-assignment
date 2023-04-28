function loadUsers()
{
   const items = [];
   for(let i=1;i<=50000;i++)
   {
     let id = "U" + i;
     let name = "Firstname" + i + " Lastname" + i;
     let phone = "+91" + i;
     phone = phone.padEnd(13, "0");
     let item = {"_id" : id, "name" : name, "phone": phone};
     items.push(item);
   }
   db.getCollection('users').insertMany(items);
}

function loadBlogs()
{
  const userIds = db.getCollection('users').find({},{name: 0, phone: 0}).toArray();
  const items = [];
  for(let i=1;i<=10000;i++)
  {
      let id = "B" + i;
      let heading = "Blog " + i;
      let text = "Text of Blog " + i;
      let comments = [];
      items.push({'_id': id, 'heading': heading, 'text' : text, 'comments': comments });
  }
  for(let i=0;i<10;i++)
  {
    for(let j=0;j<10;j++)
    {
        let a = Math.floor(Math.random()*2);
        if(a == 1)
        {
          let user = userIds[j]._id;
          let commentText = "Comment on Blog " + (i+1) + " by user " + user;
          items[i].comments.push({"user": user, "text" : commentText});
        }
    }
  }
  db.getCollection('blogs').insertMany(items);
  
}
use('userDB');
// loadUsers();
//loadBlogs();
