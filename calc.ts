import { nanoid } from "nanoid";
import fakerStatic from 'faker'
import * as Y from 'yjs'

interface Doc {
  img: string
  title: string
  description?: string
  type: string
  rel: Array<{ type: string, id: string }>
}

const types = [ 'children', 'mltilink', 'singlelink' ]

const ydoc = new Y.Doc() 
const map = ydoc.getMap()

const memusagebefore = process.memoryUsage()

for (let i = 0; i < 50000; i++) {
  const rel = []
  rel.fill({ type: types[fakerStatic.datatype.number(2)], id: nanoid() })
  const doc: Doc = {
    img: fakerStatic.image.imageUrl(),
    title: fakerStatic.random.alphaNumeric(50),
    // description: fakerStatic.random.alphaNumeric(500),
    type: fakerStatic.random.alphaNumeric(50),
    rel: rel
  }
  map.set(nanoid(), doc)
}

function roughSizeOfObject( object ) {

  var objectList = [];
  var stack = [ object ];
  var bytes = 0;

  while ( stack.length ) {
      var value = stack.pop();

      if ( typeof value === 'boolean' ) {
          bytes += 4;
      }
      else if ( typeof value === 'string' ) {
          bytes += value.length * 2;
      }
      else if ( typeof value === 'number' ) {
          bytes += 8;
      }
      else if
      (
          typeof value === 'object'
          && objectList.indexOf( value ) === -1
      )
      {
          objectList.push( value );

          for( var i in value ) {
              stack.push( value[ i ] );
          }
      }
  }
  return bytes;
}
const memoryUsageAfter = process.memoryUsage()
memoryUsageAfter.rss -= memusagebefore.rss
memoryUsageAfter.arrayBuffers -= memusagebefore.arrayBuffers
memoryUsageAfter.external -= memusagebefore.external
memoryUsageAfter.heapTotal -= memusagebefore.heapTotal
memoryUsageAfter.heapUsed -= memusagebefore.heapUsed

console.log(memoryUsageAfter);

