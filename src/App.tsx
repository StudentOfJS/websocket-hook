import { useEffect, useState } from 'react';
import './App.css';
import useWebSocket from './useWebSocket';

function App() {
  const ws = useWebSocket('wss://polkadot.webapi.subscan.io/socket');
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<Record<string, string>>({});
  const [first, setFirst] = useState<Record<string, string>>({});
  useEffect(() => {
    if (ws?.messages[ws.messages.length - 1]?.content?.finalized_blockNum) {
      setMessage(ws.messages[ws.messages.length - 1].content);
    }
    if (ws?.messages[0]?.content?.finalized_blockNum) {
      setFirst(ws.messages[0].content);
    }
    setCount(ws.messages.length);
  }, [ws.messages]);
  return (
    <div className="App">
      <div className="card">
        <h1>Polkadot websocket</h1>
        <p>
          <strong>{count} messages</strong>
        </p>
        <div style={{ marginBottom: 40 }}>
          <strong>Last message: </strong>
          {message && <MessageBlock message={message} />}
        </div>
        <div>
          <strong>First message: </strong>
          {message && <MessageBlock message={first} color="lightblue" />}
        </div>
      </div>
    </div>
  );
}

export default App;

function Val({
  color,
  item,
  value,
}: {
  color?: string;
  item: string;
  value: string;
}) {
  return (
    <div
      style={{
        margin: 10,
        padding: 10,
        backgroundColor: color ?? 'antiquewhite',
        flexGrow: 1,
      }}
    >
      <strong>{item}: </strong>
      <span>{`${value}`}</span>
    </div>
  );
}

function MessageBlock({
  message,
  color,
}: {
  message: Record<string, string>;
  color?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Val
        color={color}
        item={'finalized_blockNum'}
        value={`${message?.finalized_blockNum}`}
      />
      <Val color={color} item={'blockNum'} value={`${message?.blockNum}`} />
      <Val color={color} item={'blockTime'} value={`${message?.blockTime}`} />
      <Val color={color} item={'implName'} value={`${message?.implName}`} />
      <Val
        color={color}
        item={'validator_count'}
        value={`${message?.validator_count}`}
      />
      <Val color={color} item={'maxPools'} value={`${message?.maxPools}`} />
      <Val
        color={color}
        item={'networkNode'}
        value={`${message?.networkNode}`}
      />
      <Val
        color={color}
        item={'count_account'}
        value={`${message?.count_account}`}
      />
      <Val
        color={color}
        item={'count_event'}
        value={`${message?.count_event}`}
      />
      <Val
        color={color}
        item={'epochProcess'}
        value={`${message?.epochProcess}`}
      />
    </div>
  );
}
