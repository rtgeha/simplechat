import { Message } from "../communication/types.ts";
import { MongoClient } from "https://deno.land/x/mongo/mod.ts";

class MessageRepository {
    
  private static instance: MessageRepository;
  private messages: Message[];

  private constructor() {
    this.messages = [];
  }

  public static async getInstance(): Promise<MessageRepository> {
    if (!MessageRepository.instance) {
      MessageRepository.instance = new MessageRepository();
      this.instance.messages = await this.loadMessagesFromDB();
    }
    return MessageRepository.instance;
  }

  private static async loadMessagesFromDB(): Promise<Message[]> {
    const MONGO_USERNAME = Deno.env.get("MONGO_USERNAME") || "root";
    const MONGO_PASSWORD = Deno.env.get("MONGO_PASSWORD") || "example";
    const MONGO_HOST = Deno.env.get("MONGO_HOST") || "localhost";
    const MONGO_PORT = parseInt(Deno.env.get("MONGO_PORT") || "27017");
    const MONGO_DB_NAME = Deno.env.get("MONGO_DB_NAME") || "mydb";
    const MONGO_COLLECTION_NAME = Deno.env.get("MONGO_COLLECTION_NAME") || "messages";
    
    const uri =
      `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
    
    console.log("loading messages from database...")
    console.log(`mongodb://${MONGO_USERNAME}:<MONGO_PASSWORD>@${MONGO_HOST}:${MONGO_PORT}`);

    const client = new MongoClient();
    try {
      await client.connect(uri);

      const db = client.database(MONGO_DB_NAME);
      const collection = db.collection<Message>(MONGO_COLLECTION_NAME);

      return await collection.find({}).toArray();
    } catch (error) {
      // FIXME: remove this debug output!!!
      console.log(uri);
      console.error("Error loading messages from DB:", error);
      return []; // fall back to local functionality on DB access error
    } finally {
      client.close();
    }
  }

  public async addMessage(message: Message): Promise<void> {
    const MONGO_USERNAME = Deno.env.get("MONGO_USERNAME") || "root";
    const MONGO_PASSWORD = Deno.env.get("MONGO_PASSWORD") || "example";
    const MONGO_HOST = Deno.env.get("MONGO_HOST") || "localhost";
    const MONGO_PORT = parseInt(Deno.env.get("MONGO_PORT") || "27017");
    const MONGO_DB_NAME = Deno.env.get("MONGO_DB_NAME") || "mydb";
    const MONGO_COLLECTION_NAME = Deno.env.get("MONGO_COLLECTION_NAME") || "messages";
    const uri =
      `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

    const client = new MongoClient();
    try {
    this.messages.push(message);
      await client.connect(uri);

      const db = client.database(MONGO_DB_NAME);
      const collection = db.collection<Message>(MONGO_COLLECTION_NAME);

      await collection.insertOne(message);
    } catch (error) {
      console.log(`mongodb://${MONGO_USERNAME}:<MONGO_PASSWORD>@${MONGO_HOST}:${MONGO_PORT}`);
      console.error("Error adding message to DB:", error);
    } finally {
      client.close();
    }
  }

  public getAllMessages(): Message[] {
    return this.messages;
  }
}

export default MessageRepository;
