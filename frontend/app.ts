import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { nanoid } from 'nanoid'

interface Point {
  x: number
  y: number
}

const doc = new Y.Doc() // container for data types
const map = doc.getMap<Point>('canvas')
const wsProvider = new WebsocketProvider('ws://localhost:3000', 'test-room', doc)

wsProvider.on('status', (event) => {
  console.log(event.status);
})

const canvas = document.createElement('canvas')
canvas.width = 500
canvas.height = 500
canvas.style.background = '#F2F2F2'
const ctx = canvas.getContext('2d')

const handlePoint = (p: Point) => {
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, 4, 4, Math.PI / 4, 0, 2 * Math.PI)
  ctx.fill()
}

let down: boolean = false
canvas.onmousedown = (evt) => {
  down = true
  doc.transact(() => {
  map.set(nanoid(), { x: evt.offsetX, y: evt.offsetY })
  })
}

let prevPoint: Point | null = null

canvas.onmousemove = (evt) => {
  if (!down) return
  if (prevPoint) {
    let deltaX = evt.offsetX - prevPoint.x
    let deltaY = evt.offsetY - prevPoint.y
    let delta = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY))
    doc.transact(() => {
      for (let i = 0; i < delta; i++) {
        const propX = deltaX / delta * i + prevPoint.x
        const propY = deltaY / delta * i + prevPoint.y
        map.set(nanoid(), { x: propX, y: propY })
      }
    })
  }
  prevPoint = { x: evt.offsetX, y: evt.offsetY }
}

canvas.onmouseup = (evt) => {
  down = false
  prevPoint = null
}

map.observe((evt) => {
  evt.changes.keys.forEach((e, key) => {
    if (e.action === 'add') {
      handlePoint(map.get(key))
    }
    if (e.action === 'delete') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  })
})

const deleteButton = document.getElementById('delete')
deleteButton.onclick = (evt) => {
  doc.transact(() => {
    map.clear()
  })
}

document.body.appendChild(canvas)