import mongoose from "mongoose";
const uri = process.env.MONGODB_URI;
try {
  const t0 = Date.now();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
  const db = mongoose.connection.db;
  console.log("connected in", Date.now() - t0, "ms to", db.databaseName);
  console.log("ping:", JSON.stringify(await db.command({ ping: 1 })));
  const cols = await db.listCollections().toArray();
  console.log("collections:", cols.map((c) => c.name));
  await mongoose.disconnect();
} catch (e) {
  console.error("MONGO_ERROR", e.name, e.message);
  process.exit(1);
}
