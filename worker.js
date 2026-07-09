export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" || url.pathname === "/api/comtact") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed." }), {
      status: 405,
      headers,
    });
  }

  try {
    const url = new URL(request.url);
    const isWorkersDevHost = url.hostname.endsWith(".workers.dev");
    const body = await request.json();
    const { firstName, lastName, phone, email, address, projectType, timeline, budget, message } = body;
    const turnstileToken = body["cf-turnstile-response"];

    if (!firstName || !lastName || !phone || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Missing required fields." }), {
        status: 400,
        headers,
      });
    }

    if (!isWorkersDevHost && !turnstileToken) {
      return new Response(JSON.stringify({ ok: false, error: "CAPTCHA token missing." }), {
        status: 400,
        headers,
      });
    }

    if (!isWorkersDevHost) {
      const tsVerify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: turnstileToken,
          remoteip: request.headers.get("CF-Connecting-IP") ?? "",
        }),
      });
      const tsResult = await tsVerify.json();
      if (!tsResult.success) {
        return new Response(JSON.stringify({ ok: false, error: "CAPTCHA verification failed." }), {
          status: 403,
          headers,
        });
      }
    }

    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: env.AZURE_CLIENT_ID,
          client_secret: env.AZURE_CLIENT_SECRET,
          scope: "https://graph.microsoft.com/.default",
        }),
      }
    );

    if (!tokenRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: "Authentication failed." }), {
        status: 500,
        headers,
      });
    }

    const { access_token } = await tokenRes.json();

    const emailBody = [
      "New quote request from southerncypresshomes.com",
      "",
      `Name:         ${firstName} ${lastName}`,
      `Phone:        ${phone}`,
      `Email:        ${email}`,
      `Address:      ${address || "Not provided"}`,
      `Project Type: ${projectType || "Not specified"}`,
      `Timeline:     ${timeline || "Not provided"}`,
      `Budget:       ${budget || "Not provided"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const sendRes = await fetch(`https://graph.microsoft.com/v1.0/users/${env.MAIL_FROM}/sendMail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: `New Contact Form Request - ${firstName} ${lastName}`,
          body: {
            contentType: "Text",
            content: emailBody,
          },
          toRecipients: [{ emailAddress: { address: env.MAIL_TO } }],
          replyTo: [{ emailAddress: { address: email, name: `${firstName} ${lastName}` } }],
        },
        saveToSentItems: true,
      }),
    });

    if (!sendRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: "Failed to send message." }), {
        status: 500,
        headers,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Server error." }), {
      status: 500,
      headers,
    });
  }
}
