import { HandlerContext } from "$fresh/server.ts";
import MessageRepository from "../../communication/messageRepository.ts";
import { Message } from "../../communication/types.ts";

export async function handler(
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> {
  const messagesRepo = await MessageRepository.getInstance();
  const message = (await req.json()) as Message;

  // notify other clients
  const channel = new BroadcastChannel("chat");
  channel.postMessage(message);
  channel.close();

  // Store in memory and to DB
  messagesRepo.addMessage(message);

  return new Response("OK");
}
