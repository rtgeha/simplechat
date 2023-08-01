// messageRepository.ts

import { Message } from "../communication/types.ts";

class MessageRepository {
  private static instance: MessageRepository;
  private messages: Message[];

  private constructor() {
    this.messages = [];
  }

  public static getInstance(): MessageRepository {
    if (!MessageRepository.instance) {
      MessageRepository.instance = new MessageRepository();
    }
    return MessageRepository.instance;
  }

  public addMessage(message: Message): void {
    this.messages.push(message);
  }

  public getAllMessages(): Message[] {
    return this.messages;
  }
}

export default MessageRepository;
