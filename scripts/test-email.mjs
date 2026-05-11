/**
 * Test script for Postal Email Integration
 * Run with: node scripts/test-email.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const POSTAL_API_URL = process.env.POSTAL_API_URL;
const POSTAL_API_KEY = process.env.POSTAL_API_KEY;
const POSTAL_FROM_EMAIL = process.env.POSTAL_FROM_EMAIL;

async function testEmail() {
  console.log("Testing Postal Integration...");
  console.log("URL:", POSTAL_API_URL);
  console.log("From:", POSTAL_FROM_EMAIL);

  if (!POSTAL_API_URL || !POSTAL_API_KEY) {
    console.error("Error: Postal not configured in .env.local");
    return;
  }

  try {
    const response = await fetch(`${POSTAL_API_URL}/api/v1/send/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Server-API-Key": POSTAL_API_KEY,
      },
      body: JSON.stringify({
        to: ["godwin@zimplar.com"], // Change this to a test email
        from: `Zimplar Test <${POSTAL_FROM_EMAIL}>`,
        subject: "Zimplar Connectivity Test",
        html_body: "<h1>It Works!</h1><p>This is a test email from Zimplar to your Postal instance.</p>",
      }),
    });

    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.status === "success") {
      console.log("✅ SUCCESS: Email sent successfully!");
    } else {
      console.error("❌ FAILED:", data.data?.message || "Unknown error");
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

testEmail();
