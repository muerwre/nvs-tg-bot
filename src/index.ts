/*

  debug this:
  {"type":"wall_post_new","object":{"id":16420,"from_id":-124752609,"owner_id":-124752609,"date":1557292154,"marked_as_ads":0,"post_type":"post","text":"8 мая, среда. Сбор\/старт 19:20\/19:40. Фонтан Первомая .\nМаршрут есть, ведущих нет, темп лося в лосинах.\nПокат без ведущих и замыкающих. \n\nПривет всем тем, кто выжил вчера и тем, кто будет выживать сегодня! Ловим теплые деньки в нашел холодном сибирском городе! \n\nРезкий, дерзкий, лосёвый. Летим не крадясь, собирая все широкие и быстрые дороги, пытаемся успеть к призрачному маяку на закат за красивыми фото и атмосферой. \n\nНикого не ждём, крутим, давим, рулим, выживаем, давим на педальки, как проклятые, каждый сам за себя! АНАРХИЯ! \n\nЗ.ы. даже карта есть: https:\/\/map.vault48.org\/mayak_mezh_dvuh_shosse\nЗ.ы. з.ы. даже блины на финише будут).","signer_id":216645777,"can_edit":1,"created_by":360004,"can_delete":1,"attachments":[{"type":"photo","photo":{"id":456252150,"album_id":-7,"owner_id":-124752609,"user_id":100,"photo_75":"https:\/\/pp.userapi.com\/c850024\/v850024030\/1807d6\/9z3B6NtobyA.jpg","photo_130":"https:\/\/pp.userapi.com\/c850024\/v850024030\/1807d7\/Y8MYe3CHh30.jpg","photo_604":"https:\/\/pp.userapi.com\/c850024\/v850024030\/1807d8\/hYnjRhj66Yc.jpg","photo_807":"https:\/\/pp.userapi.com\/c850024\/v850024030\/1807d9\/GseiH9Jj2t8.jpg","width":724,"height":480,"text":"","date":1557292154,"post_id":16420,"access_key":"7d20a665468e52f389"}},{"type":"audio","audio":{"id":456242235,"owner_id":2000378805,"artist":"Бездна Анального Угнетения","title":"Спортивный металл","duration":25,"date":1557292154,"url":"https:\/\/vk.com\/mp3\/audio_api_unavailable.mp3"}}],"comments":{"count":0}},"group_id":124752609,"secret":"imalittlemonkeyja1337825"}

  and this:
  {"type":"wall_post_new","object":{"id":16419,"from_id":216645777,"owner_id":-124752609,"date":1557292020,"marked_as_ads":0,"post_type":"suggest","text":"8 мая, среда\nСбор\/старт 19:20\/19:40\nФонтан Первомая \nМаршрут есть, ведущих нет, темп лося в лосинах.\n\nПривет всем тем, кто выжил вчера и тем, кто будет выживать сегодня! Ловим теплые деньки в нашел холодном сибирском городе! \n\nРезкий, дерзкий, лосёвый. Летим не крадясь, собирая все широкие и быстрые дороги, пытаемся успеть к призрачному маяку на закат за красивыми фото и атмосферой. \n\nНикого не ждём, крутим, давим, рулим, выживаем, давим на педальки, как проклятые, каждый сам за себя! АНАРХИЯ!  \n\nЗ.ы. даже карта есть: https:\/\/map.vault48.org\/mayak_mezh_dvuh_shosse\/edit\n\nЗ.ы. з.ы. даже блины на финише будут).","can_edit":1,"created_by":216645777,"can_delete":1,"attachments":[{"type":"photo","photo":{"id":456252149,"album_id":-8,"owner_id":-124752609,"user_id":216645777,"photo_75":"https:\/\/pp.userapi.com\/c850024\/v850024030\/1807d6\/9z3B6NtobyA.jpg","photo_130":"https:\/\/pp.userapi.com\/c850024\/v850024030\/1807d7\/Y8MYe3CHh30.jpg","photo_604":"https:\/\/pp.userapi.com\/c850024\/v850024030\/1807d8\/hYnjRhj66Yc.jpg","photo_807":"https:\/\/pp.userapi.com\/c850024\/v850024030\/1807d9\/GseiH9Jj2t8.jpg","width":724,"height":480,"text":"","date":1557292020,"post_id":16419,"access_key":"d67335f6272afb5dae"}},{"type":"audio","audio":{"id":456567519,"owner_id":371745465,"artist":"Бездна Анального Угнетения","title":"Спортивный металл","duration":25,"date":1521635896,"url":"https:\/\/vk.com\/mp3\/audio_api_unavailable.mp3"}},{"type":"link","link":{"url":"https:\/\/map.vault48.org\/mayak_mezh_dvuh_shosse\/edit","title":"","description":"","target":"internal"}}],"comments":{"count":0}},"group_id":124752609,"secret":"imalittlemonkeyja1337825"}

 */
/*
  https://habr.com/company/ruvds/blog/321104/
 */
import * as createError from 'http-errors';
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser'
import * as lessMiddleware from 'less-middleware';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import '$config/db';
import mainRouter from './routes/main'

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
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

module.exports = app;

export default app;
