import type { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { Message } from "../communication/types.ts";

interface MessagesProps {
  messages: Signal<Message[]>;
}

export default function Messages(props: MessagesProps) {
  return (
    <div class="flex gap-8 py-6">
      <div class="flex-auto overflow-y-scroll">
          {props.messages.value.map((msg) => <MessageComponent message={msg} />)}
      </div>
    </div>
  );
}

function MessageComponent({ message }: { message: Message }) {
  return (
    <div class="flex mb-4.5">
      <div>
        <p class="flex items-baseline mb-1.5">
          <span class="mr-2 font-bold">
            {message.from}
          </span>
          <span class="text-xs text-gray-400 font-extralight">
            {message.createdAt}
          </span>
        </p>
        <p class="text-sm text-gray-800">{message.message}</p>
      </div>
    </div>
  );
}