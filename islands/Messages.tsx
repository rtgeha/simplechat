import { useEffect } from "preact/hooks";
import { type Signal, useSignal } from "@preact/signals";
import { Message } from "../communication/types.ts";
import { server } from "../communication/server.ts";
import twas from "twas";

interface MessagesProps {
  userName: string;
  messages: Signal<Message[]>;
}

enum ConnectionState {
  Connecting,
  Connected,
  Disconnected,
}

export default function Messages(props: MessagesProps) {
  const connectionState = useSignal(ConnectionState.Disconnected);
  const messageText = useSignal("");
  const currentUserName = props.userName;

  const send = () => {
    const msg: Message = {
      message: messageText.value,
      from: currentUserName,
      createdAt: new Date().toISOString(),
    };
    server.sendMessage(msg);

    // TODO: rely on server notification instead of doing this here manually
    //props.messages.value = props.messages.value.concat(msg);

    messageText.value = "";
  };

  useEffect(() => {
    const events = new EventSource("/api/connect");
    events.addEventListener(
      "open",
      () => connectionState.value = ConnectionState.Connected,
    );
    events.addEventListener("error", () => {
      switch (events.readyState) {
        case EventSource.OPEN:
          connectionState.value = ConnectionState.Connected;
          console.log("connected");
          break;
        case EventSource.CONNECTING:
          connectionState.value = ConnectionState.Connecting;
          console.log("connecting");
          break;
        case EventSource.CLOSED:
          connectionState.value = ConnectionState.Disconnected;
          console.log("disconnected");
          break;
      }
    });
    events.addEventListener("message", (e) => {
      const message = JSON.parse(e.data);
      props.messages.value = [...props.messages.value, message];
    });
    return () => events.close();
  }, []);

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
            {twas(new Date(message.createdAt).getTime())}
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
