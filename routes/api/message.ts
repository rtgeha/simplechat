import { HandlerContext } from "$fresh/server.ts";
import MessageRepository from "../../communication/messageRepository.ts";
import { Message } from "../../communication/types.ts";

export async function handler(
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> {
  const messagesRepo = MessageRepository.getInstance();
  const message = (await req.json()) as Message;

  // Store in memory and to DB
  messagesRepo.addMessage(message);

  // notify other clients
  const channel = new BroadcastChannel("chat");
  channel.postMessage(message);
  channel.close();

  return new Response("OK");
}
