import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    return await ctx.render();
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const userName = form.get("username")?.toString();

    // Redirect user to chat
    const headers = new Headers();
    if (userName) {
      headers.set("location", "/chat/" + userName);
    } else {
      headers.set("location", "/");
    }

    return new Response(null, {
      status: 303, // See Other
      headers,
    });
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Simple Chat</title>
      </Head>
      <div className="px-4 py-8 mx-auto bg-[#86efac] min-h-screen">
        <div className="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            className="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the fresh logo: a sliced lemon dripping with juice"
          />
          <h1 className="text-4xl font-bold mb-4">Welcome to Fresh Chat</h1>
          <form className="flex flex-col items-center" method="post">
            <input
              type="text"
              name="username"
              defaultValue="ANONYMOUS"
              required
              placeholder="Enter your username"
              className="px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              type="submit"
              className="px-6 py-3 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Start Chatting
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
