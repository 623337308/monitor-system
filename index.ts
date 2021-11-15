import os from 'os-utils'
import * as http from 'http'
import * as socket from 'socket.io'
import { diskinfo } from '@dropb/diskinfo';

const server = http.createServer()
const io = new socket.Server(server);
server.listen(4000, function () {
  console.log('listen on 4000');
});

io.sockets.on('connection', socket => {
  socket.emit("connected", "连接成功")
  console.log("连接成功")
  socket.on("disconnect", () => {
    console.log("disconnect")
  })
})

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function start(): Promise<void> {
  let cpuUse = 0
  os.cpuUsage(i => cpuUse = i * 100);
  // 获取当前可用内存
  const freemem = (os.freemem() / 1024).toFixed(2)
  // 获取总内存
  const totalmem = (os.totalmem() / 1024).toFixed(2)
  // 获取空闲内存的百分比
  const freememPercentage = os.freememPercentage()
  // 获取系统已运行的毫秒数。
  const sysUptime = (os.sysUptime() / 86400).toFixed(2)
  // 获取 1、5 或 15 分钟的平均负载
  const loadavg = [os.loadavg(1), os.loadavg(5), os.loadavg(15)]
  // sockets
  io.sockets.emit("systemInfo", { freemem, totalmem, freememPercentage, sysUptime, loadavg, diskinfo: await diskinfo() })
  await sleep(1000)
  start()
}

start()
