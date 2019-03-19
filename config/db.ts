const { CONFIG } = require('$config/server');

const {
  DB,
  DB: {
    USER, PASSWORD, HOSTNAME, PORT, DATABASE
  }
} = CONFIG;

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//
const url = CONFIG.DB.NEEDS_AUTH
  ? `mongodb://${USER}:${PASSWORD}@${HOSTNAME}:${PORT}/${DATABASE}`
  : `mongodb://${HOSTNAME}:${PORT}/${DATABASE}?authSource=adminB&w=1`;

mongoose.connect(url);
mongoose.set('debug', true);
// mongoose.createConnection(PORT, HOSTNAME, { user: USER, pass: PASSWORD, auth: { authdb: 'admin' } });
const database = mongoose.connection;

database.on('error', (err) => { console.error(`Database Connection Error: ${err}`); process.exit(2); });
database.on('connected', () => { console.info('Succesfully connected to MongoDB Database'); });

console.log(`DB: mongodb://${USER}:${PASSWORD}@${HOSTNAME}:${PORT}/${DATABASE}`);
