import { Novu } from '@novu/node';

const novuApiKey = process.env.NOVU_API_KEY;
const novuBackendUrl = process.env.NOVU_BACKEND_URL;

export const novu = novuApiKey 
  ? new Novu(novuApiKey, {
      backendUrl: novuBackendUrl
    })
  : null;

/**
 * Triggers a notification workflow in Novu
 * @param workflowId - The ID of the workflow in Novu dashboard
 * @param userId - The subscriber ID (usually User ID)
 * @param payload - Data to be used in the notification templates
 */
export async function triggerNotification(
  workflowId: string,
  userId: string,
  payload: Record<string, unknown>
) {
  if (!novu) {
    console.warn("Novu is not configured. Skipping notification trigger.");
    return;
  }

  try {
    await novu.trigger(workflowId, {
      to: {
        subscriberId: userId,
      },
      payload: payload,
    });
  } catch (error) {
    console.error("Novu trigger failed:", error);
  }
}
