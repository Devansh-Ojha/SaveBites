import dotenv from "dotenv";
import { MongoClient } from "mongodb";


dotenv.config();  // loads the .env file into process.env

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let client;
let db;

export async function getDb() {
    if (db) return db;
    client = new MongoClient(uri)
    await client.connect();
    db = client.db(dbName)
    return db
}