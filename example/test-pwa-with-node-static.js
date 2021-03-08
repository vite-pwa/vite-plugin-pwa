/* eslint-disable */
'use strict'

const http = require('http')
const https = require('https')
const fs = require("fs");
const path = require('path')
const nStatic = require('node-static')

const fileServer  = new nStatic.Server('./dist')

const file = fs.readFileSync('.env.local.json', 'utf8')

const { ca, key, cer, hostname = 'localhost', httpsPort = 443, httpPort = 80 } = JSON.parse(file)

const httpsRedirect = async(req, res) => {
  res.writeHead(301, { "Location": `https://${hostname}:${httpsPort}${req.url}` });
  res.end()
}

const secureServer = https.createServer({
  ca: fs.readFileSync(ca),
  key: fs.readFileSync(key),
  cert: fs.readFileSync(cer),
}, (req, res) => {
  fileServer.serve(req, res)
})

secureServer.listen(httpsPort, () => {
  console.log(`Server running on https://${hostname}:${httpsPort}/`)
})

const redirectServer = http.createServer(httpsRedirect)

redirectServer.listen(httpPort, () => {
  console.log(`Redirect server running on http://${hostname}:${httpPort}/`)
})
