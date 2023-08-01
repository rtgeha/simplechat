import { Message } from "../communication/types.ts";
import { MongoClient } from "https://deno.land/x/mongo/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

class MessageRepository {
  private static instance: MessageRepository;
  private messages: Message[];
  private collectionName = "messages";

  private constructor() {
    this.messages = [];
    this.loadMessagesFromDB();
  }

  public static getInstance(): MessageRepository {
    if (!MessageRepository.instance) {
      MessageRepository.instance = new MessageRepository();
    }
    return MessageRepository.instance;
  }

  private async loadMessagesFromDB(): Promise<void> {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DB_NAME,
    } = config();
    const uri =
      `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

    const client = new MongoClient();
    try {
      await client.connect(uri);

      const db = client.database(MONGO_DB_NAME);
      const collection = db.collection<Message>(this.collectionName);

      const messages = await collection.find({}).toArray();
      this.messages = messages;
    } catch (error) {
      console.error("Error loading messages from DB:", error);
    } finally {
      client.close();
    }
  }

  public async addMessage(message: Message): Promise<void> {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DB_NAME,
    } = config();
    const uri =
      `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

    const client = new MongoClient();
    try {
      await client.connect(uri);

      const db = client.database(MONGO_DB_NAME);
      const collection = db.collection<Message>(this.collectionName);

      await collection.insertOne(message);
      this.messages.push(message);
    } catch (error) {
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
