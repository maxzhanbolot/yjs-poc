import ws from 'ws'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const document = new Y.Doc()

const wsProvider = new WebsocketProvider(
  'ws://localhost:3000', 'test-room',
  document,
  { WebSocketPolyfill: ws }
)
