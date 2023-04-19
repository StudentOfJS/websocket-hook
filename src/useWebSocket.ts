import { useEffect, useReducer } from 'react';

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
  const [state, dispatch] = useReducer(webSocketReducer, initialState);

  useEffect(() => {
    const ws = new WebSocket(url);
    dispatch({ type: 'socket', socket: ws });
    ws.onopen = () => {
      // handle open
      dispatch({ type: 'readyState', readyState: WebSocket.OPEN });
    };

    ws.onclose = () => {
      // handle close
      dispatch({ type: 'readyState', readyState: WebSocket.CLOSED });
    };

    ws.onmessage = (event) => {
      // handle message
      const data = JSON.parse(event.data);
      dispatch({ type: 'message', message: data });
    };

    ws.onerror = (event) => {
      // handle error
      dispatch({ type: 'error', error: (event as ErrorEvent)?.message });
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const send = (data: any) => {
    if (state.readyState === 1) {
      state.socket?.send(data);
    }
  };

  const close = () => {
    state.socket?.close();
  };

  return {
    ...state,
    send,
    close,
    onopen: state.socket?.onopen,
    onclose: state.socket?.onclose,
    onmessage: state.socket?.onmessage,
    onerror: state.socket?.onerror,
  } as const;
};

interface WebSocketStateType {
  error: string | null;
  messages: any[];
  readyState: number;
  ready: boolean;
  socket: WebSocket | null;
}
const initialState: WebSocketStateType = {
  error: null,
  messages: [],
  ready: false,
  readyState: WebSocket.CONNECTING,
  socket: null,
};

type ActionType =
  | { type: 'error'; error: string | null }
  | { type: 'message'; message: any[] }
  | { type: 'readyState'; readyState: number }
  | { type: 'socket'; socket: WebSocket | null };

const webSocketReducer = (
  state: WebSocketStateType,
  action: ActionType
): WebSocketStateType => {
  switch (action.type) {
    case 'error':
      return { ...state, error: action.error };
    case 'message':
      return { ...state, messages: [...state.messages, action.message] };
    case 'readyState':
      return {
        ...state,
        readyState: action.readyState,
        ready: action.readyState === 1,
      };
    case 'socket':
      return { ...state, socket: action.socket };
    default:
      return state;
  }
};

export default useWebSocket;
