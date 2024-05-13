const { MongoClient} = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "gamedb";

async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const usersCollection = db.collection("users");

  const user = {login: "tom", password: "tom123"};
  const insertResult = await usersCollection.insertOne(user);
  console.log(`Inserter document => ${insertResult}`);

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close);