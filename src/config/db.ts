const { CONFIG } = require('~/config/server');

const {
  DB: { USER, PASSWORD, HOSTNAME, PORT, DATABASE },
} = CONFIG;

export const url = `mysql://${USER}:${PASSWORD}@${HOSTNAME}:${PORT}/${DATABASE}`;

console.log(url);
