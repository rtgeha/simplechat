import { HandlerContext } from "$fresh/server.ts";
import { Message } from "../../communication/types.ts";

export async function handler(
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> {
  const message = (await req.json()) as Message;
  console.dir(message);
  
  // TODO: store to DB
  
  // notify other clients
  const channel = new BroadcastChannel("chat");
  channel.postMessage(message);
  channel.close();

  return new Response("OK");
}
