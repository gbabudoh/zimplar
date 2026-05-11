/**
 * Postal Email Integration for Zimplar
 * Connects to the user's self-hosted Postal instance
 */

const POSTAL_API_URL = process.env.POSTAL_API_URL;
const POSTAL_API_KEY = process.env.POSTAL_API_KEY;
const POSTAL_FROM_EMAIL = process.env.POSTAL_FROM_EMAIL || "notifications@zimplar.com";
const POSTAL_FROM_NAME = process.env.POSTAL_FROM_NAME || "Zimplar";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  if (!POSTAL_API_URL || !POSTAL_API_KEY) {
    console.warn("Postal API is not configured. Email not sent.");
    return;
  }

  const recipients = Array.isArray(to) ? to : [to];

  try {
    const response = await fetch(`${POSTAL_API_URL}/api/v1/send/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Server-API-Key": POSTAL_API_KEY,
      },
      body: JSON.stringify({
        to: recipients,
        from: `${POSTAL_FROM_NAME} <${POSTAL_FROM_EMAIL}>`,
        subject,
        html_body: html,
        plain_body: text || subject,
      }),
    });

    const data = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.data?.message || "Postal email delivery failed");
    }

    return data;
  } catch (error) {
    console.error("Postal Email Error:", error);
    throw error;
  }
}
