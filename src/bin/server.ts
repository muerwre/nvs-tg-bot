#!/usr/bin/env node
import 'reflect-metadata';
import { CONFIG } from '~/config/server';

const index = require('../index');
const http = require('http');

if (CONFIG.HTTP.ENABLED) {
  const httpPort = CONFIG.HTTP.PORT;

  const httpServer = http.createServer(index);
  httpServer.listen(httpPort);

  httpServer.on('error', console.log);
  httpServer.on('listening', console.log);
}
