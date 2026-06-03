import { onBeforeUnmount, onMounted } from "vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";

interface RealtimeMessage {
  id?: number;
  event?: string;
  payload?: Record<string, unknown>;
}

interface RealtimeRefreshOptions {
  events?: string[];
}

interface RealtimeSubscriber {
  events: string[];
  refresh: (message: RealtimeMessage) => Promise<void> | void;
  isRefreshing: boolean;
}

const subscribers = new Set<RealtimeSubscriber>();

let abortController: AbortController | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let lastEventId: number | null = null;
let isConnecting = false;
let hasVisibilityListener = false;

const scheduleReconnect = () => {
  if (reconnectTimeout || subscribers.size === 0 || document.hidden) return;

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    void connect();
  }, 1000);
};

const runSubscriberRefresh = async (
  subscriber: RealtimeSubscriber,
  message: RealtimeMessage,
) => {
  if (subscriber.isRefreshing) return;

  subscriber.isRefreshing = true;
  try {
    await subscriber.refresh(message);
  } finally {
    subscriber.isRefreshing = false;
  }
};

const dispatchRealtimeMessage = async (message: RealtimeMessage) => {
  if (!message.event) return;

  await Promise.all(
    Array.from(subscribers)
      .filter((subscriber) => subscriber.events.includes(message.event || ""))
      .map((subscriber) => runSubscriberRefresh(subscriber, message)),
  );
};

const readEventStream = async (response: Response) => {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";

    for (const chunk of chunks) {
      const lines = chunk.split("\n");
      const idLine = lines.find((line) => line.startsWith("id: "));
      const dataLine = lines.find((line) => line.startsWith("data: "));

      if (!dataLine) continue;

      const message = JSON.parse(dataLine.replace("data: ", "")) as RealtimeMessage;
      const eventId = Number(message.id || idLine?.replace("id: ", ""));
      if (Number.isFinite(eventId) && eventId >= 0) {
        lastEventId = eventId;
      }

      await dispatchRealtimeMessage(message);
    }
  }
};

const connect = async () => {
  if (document.hidden || isConnecting || subscribers.size === 0) return;

  abortController = new AbortController();
  isConnecting = true;

  const eventUrl =
    lastEventId === null
      ? `${API_URL}/realtime/events`
      : `${API_URL}/realtime/events?last_event_id=${lastEventId}`;

  try {
    const response = await fetch(eventUrl, {
      headers: {
        ...getAuthHeaders(),
        Accept: "text/event-stream",
      },
      signal: abortController.signal,
    });

    if (response.ok) {
      await readEventStream(response);
    }
  } catch (error: any) {
    if (error?.name === "AbortError") return;
  } finally {
    isConnecting = false;

    if (!abortController?.signal.aborted) {
      scheduleReconnect();
    }
  }
};

const handleVisibilityChange = () => {
  if (document.hidden) {
    abortController?.abort();
    return;
  }

  void connect();
};

const startRealtimeHub = () => {
  if (!hasVisibilityListener) {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    hasVisibilityListener = true;
  }

  void connect();
};

const stopRealtimeHubIfUnused = () => {
  if (subscribers.size > 0) return;

  abortController?.abort();

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (hasVisibilityListener) {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    hasVisibilityListener = false;
  }
};

export function useRealtimeRefresh(
  refresh: (message: RealtimeMessage) => Promise<void> | void,
  options: RealtimeRefreshOptions = {},
) {
  const allowedEvents = options.events ?? [
    "pemesanan.changed",
  ];
  const subscriber: RealtimeSubscriber = {
    events: allowedEvents,
    refresh,
    isRefreshing: false,
  };

  onMounted(() => {
    subscribers.add(subscriber);
    startRealtimeHub();
  });

  onBeforeUnmount(() => {
    subscribers.delete(subscriber);
    stopRealtimeHubIfUnused();
  });
}
