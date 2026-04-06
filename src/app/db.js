import Dexie from "dexie";

export const db = new Dexie("WhatsAppCloneDB");

db.version(1).stores({
  queries: "_id",
  agents: "_id",
  query: "_id",
});

export default db;