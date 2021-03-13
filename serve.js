
const proxy = require('express-http-proxy')
const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const port = '80'

const interfaces = require('os').networkInterfaces()

const LOCAL_IP = getIPAddress()
const app = express()

const localUri = `https://localhost:${port}/`
const ipUri = `https://${LOCAL_IP}:${port}/`
const url = `https://test.chehejia.com`

const options = {
  key: fs.readFileSync('./serve.key'),
  cert: fs.readFileSync('./serve.crt')
}

// app.use('/', proxy('http://localhost:10918', {
//   proxyReqPathResolver: function (req, res) {
//       console.log(res)
//     // console.log('proxy is done')
//     return req.url
//   }
// }))

var httpsServer = https.createServer(options, app)
var httpServer = http.createServer(app)

// app.use(express.static(path.join(__dirname, './dist')))
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist', 'index.html'))
})
// https监听3000端口
httpsServer.listen(443)
// http监听3001端口
httpServer.listen(80)
// app.listen(port, () => {
console.log(`应用启动: ${localUri}`)
console.log(`应用启动: ${ipUri}`)
console.log(`应用启动: ${url}`)
// })

function getIPAddress () {
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
  return 'localhost'
}
