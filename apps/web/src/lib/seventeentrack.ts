import { serverEnv } from "./env";

export async function fetchTrackingStatus(trackingNumber: string) {
  if (!serverEnv.SEVENTEENTRACK_API_KEY) {
    return {
      status: "INFO_RECEIVED",
      lastCheckpoint: "Awaiting first scan",
    };
  }

  const res = await fetch("https://api.17track.net/track/v2/gettrackinfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "17token": serverEnv.SEVENTEENTRACK_API_KEY,
    },
    body: JSON.stringify({
      data: [{ number: trackingNumber }],
    }),
  });

  if (!res.ok) {
    console.error("17Track error", await res.text());
    return null;
  }

  const payload = (await res.json()) as {
    data: { track_info?: { status?: string; tracking?: { last_event?: string } } }[];
  };

  const track = payload.data.at(0)?.track_info;
  return {
    status: track?.status ?? "UNKNOWN",
    lastCheckpoint: track?.tracking?.last_event ?? "",
  };
}
