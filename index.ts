import osu from 'node-os-utils'
import minimist from 'minimist'
import * as http from 'http'
import * as socket from 'socket.io'
import { diskinfo } from '@dropb/diskinfo';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
const args = minimist(process.argv.slice(2))
const { cpu, os, users, mem, netstat } = osu
const server = http.createServer()
const io = new socket.Server(server, {
  transports: ['websocket', 'polling']
});

const port = args?.p || 4000
server.listen(port, function () {
  console.log('listen on 4000');
});

io.sockets.on('connection', (socket: socket.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
  const { headers: { origin }, time } = socket.handshake
  console.log("连接成功")
  console.log('origin', origin)
  console.log('time', time)
  socket.emit("connected", {
    type: os.type(), // 平台类型 linux
    arch: os.arch(), // x64 x32
    model: cpu.model() // Intel(R) Xeon(R) Platinum 8255C CPU @2.50GHz
  })
  socket.on("disconnect", () => { console.log("连接断开") })
})

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function start(): Promise<void> {
  io.sockets.emit("systemInfo", {
    cpuUse: await cpu.usage(),
    openedCount: await users.openedCount(),
    uptime: (os.uptime() / 86400).toFixed(2),
    loadavg: [(cpu.loadavgTime(1)).toFixed(2), (cpu.loadavgTime(5)).toFixed(2), (cpu.loadavgTime(15)).toFixed(2)],
    mem: await mem.info(),
    netstat: await netstat.inOut(),
    diskinfo: await diskinfo()
  })
  await sleep(1000)
  start()
}

start()
