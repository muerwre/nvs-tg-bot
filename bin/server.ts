#!/usr/bin/env node
import { CONFIG } from '../config/server';

import index from '../src/index'
import * as http from 'http';
// import * as fs from 'fs';
 // const https = require('https');

if (CONFIG.HTTP.ENABLED) {
  const httpPort = CONFIG.HTTP.PORT;
  // app.set('port', httpPort);

  const httpServer = http.createServer(index);
  httpServer.listen(httpPort);

  httpServer.on('error', console.log);
  httpServer.on('listening', console.log);
}
//
// if (CONFIG.HTTPS.ENABLED) {
//   const sslPort = CONFIG.HTTPS.PORT;
//   // app.set('port', sslPort);
//
//   const key = fs.readFileSync(CONFIG.HTTPS.PRIVATE_KEY, 'utf8');
//   const cert = fs.readFileSync(CONFIG.HTTPS.CERTIFICATE, 'utf8');
//   const ca = fs.readFileSync(CONFIG.HTTPS.CA, 'utf8');
//
//   const sslServer = https.createServer({ key, cert, ca }, app);
//
//   sslServer.listen(sslPort);
//   sslServer.on('error', console.log);
//   sslServer.on('listening', console.log);
// }
//
