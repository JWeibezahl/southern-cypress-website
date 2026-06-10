/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Required environment variables (set in Cloudflare Pages → Settings → Environment Variables):
 *   AZURE_TENANT_ID     – Your Azure AD / Entra ID tenant ID
 *   AZURE_CLIENT_ID     – App registration client ID
 *   AZURE_CLIENT_SECRET – App registration client secret
 *   MAIL_FROM           – M365 mailbox to send FROM (must have Mail.Send permission)
 *   MAIL_TO             – Destination address (e.g. sales@southerncypresshomes.com)
 */

export async function onRequestPost(context) {
  const { env, request } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, address, projectType, timeline, budget, message } = body;

    // Basic server-side validation
    if (!firstName || !lastName || !phone || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Missing required fields." }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 1. Obtain access token from Azure AD using client_credentials flow
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
      const err = await tokenRes.text();
      console.error("Token fetch failed:", err);
      return new Response(JSON.stringify({ ok: false, error: "Authentication failed." }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const { access_token } = await tokenRes.json();

    // 2. Build email body
    const emailBody = `
New quote request from southerncypresshomes.com

Name:         ${firstName} ${lastName}
Phone:        ${phone}
Email:        ${email}
Address:      ${address || "Not provided"}
Project Type: ${projectType || "Not specified"}
Timeline:     ${timeline || "Not provided"}
Budget:       ${budget || "Not provided"}

Message:
${message}
`.trim();

    // 3. Send email via Microsoft Graph
    const mailRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${env.MAIL_FROM}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: `New Quote Request – ${firstName} ${lastName}`,
            body: {
              contentType: "Text",
              content: emailBody,
            },
            toRecipients: [
              { emailAddress: { address: env.MAIL_TO } },
            ],
            replyTo: [
              { emailAddress: { address: email, name: `${firstName} ${lastName}` } },
            ],
          },
          saveToSentItems: true,
        }),
      }
    );

    if (!mailRes.ok) {
      const err = await mailRes.text();
      console.error("Graph sendMail failed:", err);
      return new Response(JSON.stringify({ ok: false, error: "Failed to send message." }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });

  } catch (e) {
    console.error("Unhandled error:", e);
    return new Response(JSON.stringify({ ok: false, error: "Server error." }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Handle OPTIONS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
