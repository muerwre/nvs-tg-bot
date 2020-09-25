import 'reflect-metadata';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import lessMiddleware from 'less-middleware';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mainRouter from './routes/main';
import { createConnection } from 'typeorm';
import { CONFIG } from '$config/server';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import bot from '~/bot';
var process = require('process');

const app = express();

console.log(`HTTP ATTACHED TO ON ${CONFIG.HTTP.PORT}`);

process.on('SIGINT', () => {
  console.info('Interrupted');
  process.exit(0);
});

createConnection({
  type: 'mysql',
  host: CONFIG.DB.HOSTNAME,
  username: CONFIG.DB.USER,
  password: CONFIG.DB.PASSWORD,
  port: CONFIG.DB.PORT || 3606,
  database: CONFIG.DB.DATABASE,
  synchronize: true,
  entities: [`${__dirname}/entity/*`],
  logging: true,
} as MysqlConnectionOptions).then(() => {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(logger('tiny'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(lessMiddleware(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  if (CONFIG.HTTP.WEBHOOK_URL) {
    console.log(`USING WEBHOOKCALLBACK AT ${CONFIG.HTTP.WEBHOOK_URL}`);
    app.use(bot.webhookCallback(CONFIG.HTTP.WEBHOOK_URL));
  }

  app.use(bodyParser.json());
  app.use(express.json());

  app.use('/', mainRouter);

  app.use((req, res, next) => next(createError(404)));

  // error handler
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});

module.exports = app;

export default app;
