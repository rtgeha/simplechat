import type { Message } from "./types.ts";

export class Server {
  
  sendMessage(message: Message) {
    fetch("/api/message", {
      method: "POST",
      body: JSON.stringify(message),
    });
  }
}
export const server = new Server();
