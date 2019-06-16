const { MongoClient, ObjectId } = require("mongodb");

const DB_NAME = "SPCXWappDB";

async function MongoDB(dbName = DB_NAME) {
  const URL = "mongodb://localhost:27017";
  const client = new MongoClient(`${URL}/${dbName}`, {
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
      db.collection(COLLECTION).findOne({ _id: ObjectId(id) }),
    insert: async (COLLECTION, obj) => {
      const result = await db.collection(COLLECTION).insertOne(obj);
      return result.ops[0];
    },
    delete: (COLLECTION, id) =>
      db.collection(COLLECTION).deleteOne({ _id: ObjectId(id) })
  };
}

module.exports = MongoDB;
