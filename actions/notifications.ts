"use server";

/**
 * Sends a notification via ntfy.sh
 * @param topic The ntfy topic to send to
 * @param title The title of the notification
 * @param message The message body
 * @param priority Priority level (1-5, where 5 is max)
 */
export async function sendNotification(
  topic: string,
  title: string,
  message: string,
  priority: number = 3
) {
  try {
    const response = await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      body: message,
      headers: {
        "Title": title,
        "Priority": priority.toString(),
        "Tags": "graduation_cap"
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Notification Error:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
