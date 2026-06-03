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

export function useRealtimeRefresh(
  refresh: (message: RealtimeMessage) => Promise<void> | void,
  options: RealtimeRefreshOptions = {},
) {
  const allowedEvents = options.events ?? [
    "pemesanan.changed",
  ];

  let abortController: AbortController | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let isRefreshing = false;
  let lastEventId: number | null = null;

  const runRefresh = async (message: RealtimeMessage) => {
    if (isRefreshing) return;

    isRefreshing = true;
    try {
      await refresh(message);
    } finally {
      isRefreshing = false;
    }
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

        if (!message.event || !allowedEvents.includes(message.event)) continue;

        await runRefresh(message);
      }
    }
  };

  const connect = async () => {
    if (document.hidden) return;

    abortController?.abort();
    abortController = new AbortController();
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

      if (!response.ok) return;

      await readEventStream(response);
    } catch (error: any) {
      if (error?.name === "AbortError") return;
    } finally {
      if (!abortController?.signal.aborted && !document.hidden) {
        reconnectTimeout = setTimeout(connect, 1000);
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

  onMounted(() => {
    void connect();
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onBeforeUnmount(() => {
    abortController?.abort();
    document.removeEventListener("visibilitychange", handleVisibilityChange);

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
  });
}
