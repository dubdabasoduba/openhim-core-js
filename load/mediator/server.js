'use strict'

const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')
const tcp = require('net')
const tls = require('tls')

const httpHandler = require('./http-handler')
const tcpHandler = require('./tcp-handler')

const config = {
  httpPort: +(process.env.HTTP_PORT || 8080),
  httpsPort: +(process.env.HTTPS_PORT || 8443),
  tcpBodyPort: +(process.env.TCP_BODY_PORT || 9000),
  tlsBodyPort: +(process.env.TCP_BODY_PORT || 9001)
}

const tlsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'tls', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'tls', 'cert.pem'))
}

const httpServer = http.createServer(httpHandler.handleRequest)
httpServer.listen(config.httpPort, () => {
  console.log(`HTTP server started on ${config.httpPort}`)
})

const httpsServer = https.createServer(tlsOptions, httpHandler.handleRequest)
httpsServer.listen(config.httpsPort, () => {
  console.log(`HTTPS server started on ${config.httpsPort}`)
})

const tcpBodyServer = tcp.createServer(tcpHandler.handleBodyRequest)
tcpBodyServer.listen(config.tcpBodyPort, () => {
  console.log(`TCP body server started on ${config.tcpBodyPort}`)
})

const tlsBodyServer = tls.createServer(tlsOptions, tcpHandler.handleBodyRequest)
tlsBodyServer.listen(config.tlsBodyPort, () => {
  console.log(`TCP body server started on ${config.tlsBodyPort}`)
})
