import Pusher from "pusher-js";

const PUSHER_KEY = (import.meta.env.VITE_PUSHER_APP_KEY || "").trim();
const PUSHER_CLUSTER = (import.meta.env.VITE_PUSHER_APP_CLUSTER || "ap1").trim();

let pusherClient: Pusher | null = null;

export function getPusherClient(): Pusher | null {
  if (!PUSHER_KEY) {
    return null;
  }

  if (!pusherClient) {
    pusherClient = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
    });
  }

  return pusherClient;
}
