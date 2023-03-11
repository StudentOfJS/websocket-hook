import { useState, useEffect } from 'react';

interface WebSocketMessage {
  data: any;
}

interface WebSocketConnection {
  messages: any[];
  error: string | null;
  send: (data: any) => void;
  close: () => void;
  ready: boolean;
  onopen: ((this: WebSocket, ev: Event) => any) | null | undefined;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null | undefined;
  onmessage:
    | ((this: WebSocket, ev: MessageEvent<WebSocketMessage>) => any)
    | null
    | undefined;
  onerror: ((this: WebSocket, ev: ErrorEvent) => any) | null | undefined;
}

const useWebSocket = (url: string): WebSocketConnection => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onopen = () => {
      setReadyState(WebSocket.OPEN);
    };

    ws.onclose = () => {
      setReadyState(WebSocket.CLOSED);
    };

    ws.onmessage = (event) => {
      // handle message
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    ws.onerror = (event) => {
      // handle error
      event && setError((event as ErrorEvent)?.message);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const send = (data: any) => {
    if (readyState === 1) {
      socket?.send(data);
    }
  };

  const close = () => {
    socket?.close();
  };

  return {
    messages,
    error,
    send,
    close,
    ready: readyState === 1,
    onopen: socket?.onopen,
    onclose: socket?.onclose,
    onmessage: socket?.onmessage,
    onerror: socket?.onerror,
  } as const;
};

export default useWebSocket;
