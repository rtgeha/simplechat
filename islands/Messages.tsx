import { useEffect, useRef } from "preact/hooks";
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
    events.addEventListener("open", () => (connectionState.value = ConnectionState.Connected));
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

    // Scroll to the bottom when new messages are rendered
    scrollToBottom();

    return () => events.close();
  }, [props.messages.value]); // Only trigger the effect when new messages are received

  function scrollToBottom() {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }

  return (
    <div class="mx-auto p-4 w-full max-w-screen-md flex flex-col items-center">
      <div class="mb-4">
        <ConnectionStateDisplay state={connectionState} />
      </div>
      <div ref={messagesContainerRef} class="flex-auto w-full h-80 overflow-y-scroll p-2 bg-green-200 rounded-lg">
        {props.messages.value.map((msg) => (
          <MessageComponent
            message={msg}
            isCurrentUser={msg.from === currentUserName}
            key={msg.createdAt}
          />
        ))}
      </div>
      <div class="w-full mt-4">
        <ChatInput userName={props.userName} onSend={send} messageText={messageText} />
      </div>
    </div>
  );
}

function ConnectionStateDisplay({ state }: { state: Signal<ConnectionState> }) {
  let text = "";
  switch (state.value) {
    case ConnectionState.Connecting:
      text = "🟡 Connecting...";
      break;
    case ConnectionState.Connected:
      text = "🟢 Connected";
      break;
    case ConnectionState.Disconnected:
      text = "🔴 Disconnected";
      break;
  }
  return <span class="text-center block py-2 px-4 text-lg font-bold rounded">{text}</span>;
}

function MessageComponent({ message, isCurrentUser }: { message: Message; isCurrentUser: boolean }) {
  const time = twas(new Date(message.createdAt).getTime());
  return (
    <div class={`flex flex-col mb-2 ${isCurrentUser ? "items-end" : "items-start"}`} style={{ maxWidth: "80%" }}>
      <div class={`bg-${isCurrentUser ? "green" : "gray"}-100 rounded-lg py-2 px-3 text-sm max-w-sm`}>
        <p class={`text-${isCurrentUser ? "green" : "gray"}-800 font-bold mb-1`}>
          {isCurrentUser ? "You" : message.from}
        </p>
        <p class="text-gray-800">{message.message}</p>
        <span class="text-xs text-gray-400 font-extralight">{time}</span>
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
          class="block w-full p-2 focus:text-gray-700 border border-gray-300 rounded-lg resize-none"
          value={messageText}
          onKeyDown={(e) => handleChange(e) && e.key === "Enter" && onSend()}
        />
        <button
          class="mx-3 p-2 bg-gray-200 rounded-2xl hover:bg-gray-300 focus:outline-none"
          onClick={onSend}
        >
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
