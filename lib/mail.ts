import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "noreply@zimplar.com";
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || "Zimplar";

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT || "587"),
  secure: SMTP_SECURE,
  auth: SMTP_USER && SMTP_PASSWORD ? {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  } : undefined,
});

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
  if (!SMTP_HOST) {
    console.warn("SMTP email host is not configured. Email not sent.");
    console.log(`Email content summary: To: ${to}, Subject: ${subject}`);
    return;
  }

  const recipients = Array.isArray(to) ? to.join(", ") : to;

  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: recipients,
      subject,
      text: text || subject,
      html,
    });

    return info;
  } catch (error) {
    console.error("SMTP Email Error:", error);
    throw error;
  }
}
