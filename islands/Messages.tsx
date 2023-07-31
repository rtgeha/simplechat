import { useRef } from "preact/hooks";
import { type Signal, useSignal } from "@preact/signals";
import { Message } from "../communication/types.ts";

interface MessagesProps {
  userName: string;
  messages: Signal<Message[]>;
}
//let currentUserName: string;

export default function Messages(props: MessagesProps) {
  const messageText = useSignal("");
  const currentUserName = props.userName;
  const send = () => {
    //TODO: implement send logic
    const msg: Message = {
      message: messageText.value,
      from: currentUserName,
      createdAt: new Date().toISOString(),
    };
    props.messages.value = props.messages.value.concat(msg);

    messageText.value = "";
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div class="mx-auto flex flex-col items-center justify-center" height="60%">
      <div class="flex-auto overflow-y-scroll">
        {props.messages.value.map((msg) => <MessageComponent message={msg} />)}
      </div>
      <div>
        <ChatInput
          userName={props.userName}
          onSend={send}
          messageText={messageText}
        />
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

function ChatInput({ userName, onSend, messageText }: {
  userName: string;
  onSend: () => void;
  messageText: Signal<string>;
}) {
  // deno-lint-ignore no-explicit-any
  const handleChange = (event: any) => {
    messageText.value = event.target?.value;
    return true;
  };
  return (
    <>
      <div class="flex">
        <textarea
          name="message"
          placeholder="Type your message here"
          class="block mx-6 w-full focus:text-gray-700"
          value={messageText}
          onKeyDown={(e) => handleChange(e) && e.key === "Enter" && onSend()}
        />
        <button class="mx-3 p-2 hover:bg-gray-200 rounded-2xl" onClick={onSend}>
          <svg
            class="w-5 h-5 text-gray-500 origin-center transform rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </>
  );
}
