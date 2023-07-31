import { HandlerContext } from "$fresh/server.ts";
import { Message } from "../../communication/types.ts";

export async function handler(
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> {
  const message = (await req.json()) as Message;
  console.dir(message);
  // TODO: store to DB
  // TODO: update connected clients
  return new Response("OK");
}
