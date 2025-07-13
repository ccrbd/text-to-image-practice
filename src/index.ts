export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      // serve a simple form
      return new Response(
        `<!DOCTYPE html>
        <html>
          <body style="font-family:sans-serif; padding:2rem;">
            <h1>Stable Diffusion on Cloudflare</h1>
            <form method="POST">
              <label>
                Enter your prompt:<br/>
                <input name="prompt" type="text" style="width:100%; padding:.5rem" required />
              </label><br/><br/>
              <button type="submit" style="padding:.5rem 1rem">Generate Image</button>
            </form>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (request.method === "POST") {
      // grab prompt from form
      const form = await request.formData();
      const prompt = form.get("prompt")?.toString() || "";

      // call AI
      const image = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        { prompt }
      );

      // return the PNG
      return new Response(image, {
        headers: { "Content-Type": "image/png" },
      });
    }

    return new Response("Method Not Allowed", { status: 405 });
  },
} satisfies ExportedHandler<Env>;
