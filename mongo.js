const MongoClient = require("mongodb").MongoClient;

async function MongoDB() {
  const URL = "mongodb://localhost:27017";
  const DB_NAME = "SPCXWappDB";
  const client = new MongoClient(`${URL}/${DB_NAME}`, {
    useNewUrlParser: true
  });
  await client.connect();
  const db = client.db(dbName);
  return {
    db,
    client,
    getAll: COLLECTION =>
      db
        .collection(COLLECTION)
        .find({})
        .toArray(),
    getById: (COLLECTION, id) =>
      db.collection(COLLECTION).findOne(ObjectId(id)),
    insert: async (COLLECTION, obj) => {
      const result = await db.collection(COLLECTION).insertOne(obj);
      return result.ops[0];
    },
    delete: (COLLECTION, id) =>
      db.collection(COLLECTION).deleteOne(ObjectId(id))
  };
}

module.exports = MongoDB;
