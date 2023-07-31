import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import { Message } from "../../communication/types.ts";
import Messages from "../../islands/Messages.tsx";

export default function Chat(props: PageProps) {
  const messages: Message[] = [
    {
      message: "Hello!",
      from: "JohnDoe",
      createdAt: new Date().toISOString(),
    },
    {
      message: "Hi there!",
      from: "JaneDoe",
      createdAt: new Date().toISOString(),
    },
  ];
  const messagesSignal = useSignal(messages);
  return (
    <>
      <Head>
        <title>simplechat</title>
      </Head>
      <div class="px-4 py-8 mx-auto bg-[#86efac]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-4xl font-bold">Hello {props.params.name}</h1>
          
          <Messages messages={messagesSignal} />
        </div>
      </div>
    </>
  );
}
