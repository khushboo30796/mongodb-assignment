const { MongoClient, ServerApiVersion } = require("mongodb");
function usersRepo()
{
  const uri = "mongodb+srv://khushboosharma30796:helloMongoDB7@cluster0.imco894.mongodb.net";
  const dbName = "userDB";
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);
    function getUsers(query, projection, limit) {
        return new Promise(async (resolve, reject) => {
          try {
            await client.connect();
            const db = client.db(dbName);
    
            let items = db.collection('users').find(query, projection);
            if (limit > 0) {
              items = items.limit(limit);
            }
            resolve(await items.toArray());
          } catch (error) {
            reject(error);
          }
          finally
          {
            //client.close();
          }
        });
      }
      function getBlogs(query,projection, limit) {
        return new Promise(async (resolve, reject) => {
          try {
            await client.connect();
            const db = client.db(dbName);
    
            let items = db.collection('blogs').find(query, projection);
            if (limit > 0) {
              items = items.limit(limit);
            }
            resolve(await items.toArray());
            client.close();
          } catch (error) {
            reject(error);
          }
        });
      }
      return {getUsers, getBlogs};
  }
    module.exports = usersRepo();

