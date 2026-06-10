/**
 * Azure Function – HTTP Trigger: POST /api/contact
 *
 * Set these in Azure Portal → Function App → Configuration → Application Settings:
 *   AZURE_TENANT_ID     – your Entra ID tenant ID
 *   AZURE_CLIENT_ID     – app registration client ID
 *   AZURE_CLIENT_SECRET – app registration client secret
 *   MAIL_FROM           – shared mailbox address (sales@southerncypresshomes.com)
 *   MAIL_TO             – destination address (sales@southerncypresshomes.com)
 *   ALLOWED_ORIGIN      – your site URL e.g. https://southerncypresshomes.com
 */

module.exports = async function (context, req) {
  const origin = process.env.ALLOWED_ORIGIN || "*";

  const cors = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: cors, body: "" };
    return;
  }

  if (req.method !== "POST") {
    context.res = { status: 405, headers: cors, body: JSON.stringify({ ok: false, error: "Method not allowed." }) };
    return;
  }

  const { firstName, lastName, phone, email, address, projectType, timeline, budget, message } = req.body || {};

  if (!firstName || !lastName || !phone || !email || !message) {
    context.res = { status: 400, headers: cors, body: JSON.stringify({ ok: false, error: "Missing required fields." }) };
    return;
  }

  try {
    // 1. Get access token from Azure AD
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.AZURE_CLIENT_ID,
          client_secret: process.env.AZURE_CLIENT_SECRET,
          scope: "https://graph.microsoft.com/.default",
        }),
      }
    );

    if (!tokenRes.ok) {
      context.log.error("Token fetch failed:", await tokenRes.text());
      context.res = { status: 500, headers: cors, body: JSON.stringify({ ok: false, error: "Authentication failed." }) };
      return;
    }

    const { access_token } = await tokenRes.json();

    // 2. Build plain-text email body
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

    // 3. Send via Microsoft Graph (send as shared mailbox)
    const mailRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${process.env.MAIL_FROM}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: `New Quote Request – ${firstName} ${lastName}`,
            body: { contentType: "Text", content: emailBody },
            toRecipients: [{ emailAddress: { address: process.env.MAIL_TO } }],
            replyTo: [{ emailAddress: { address: email, name: `${firstName} ${lastName}` } }],
          },
          saveToSentItems: true,
        }),
      }
    );

    if (!mailRes.ok) {
      context.log.error("Graph sendMail failed:", await mailRes.text());
      context.res = { status: 500, headers: cors, body: JSON.stringify({ ok: false, error: "Failed to send message." }) };
      return;
    }

    context.res = { status: 200, headers: cors, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    context.log.error("Unhandled error:", err);
    context.res = { status: 500, headers: cors, body: JSON.stringify({ ok: false, error: "Server error." }) };
  }
};
