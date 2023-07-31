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
          <h1 class="text-4xl font-bold">Welcome to fresh chat</h1>
          <form method="post">
            <input type="text" name="username" value="ANONYMOUS" required/>
            <button type="submit">Start chatting</button>
          </form>
        </div>
      </div>
    </>
  );
}
