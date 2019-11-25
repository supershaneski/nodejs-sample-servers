const serve = require('koa-static');
const Koa = require('koa');
const fs = require('fs');
const app = new Koa();
const Router = require('koa-router');
const utils = require('./utils.js');

const SERVER_IP_ADDRESS = utils.getIPAddress();
const SERVER_IP_PORT = 9090;

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  utils.writeLog(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

var path = require('path');
app.use(serve(path.join(__dirname,'../public/')));

var router = new Router();

// routes
router.get(['/users', '/memes'], (ctx, next) => {
  ctx.body = 'User test';
});
router.get('/users/:id', (ctx, next) => {
  ctx.body = 'World id:' + ctx.params.id;
});

router.get(['/media'], (ctx, next) => {
  const index = utils.getRandomInt(0,3);
  const fpath = path.join(__dirname, "../media/pic" + index + ".jpg");
  ctx.set('Content-Type', 'image/jpeg');
  ctx.body = fs.createReadStream(fpath);

});
router.get(['/media/:id'], (ctx, next) => {
  const fpath = path.join(__dirname, "../" + ctx.path);
  ctx.set('Content-Type', 'image/jpeg');
  ctx.body = fs.createReadStream(fpath);
});

router.get(['/image'], (ctx, next) => {
  const index = utils.getRandomInt(0,3);
  const fpath = path.join(__dirname, "../media/pic" + index + ".jpg");
  ctx.set('Content-Type', 'image/jpeg');
  ctx.body = fs.createReadStream(fpath);
});
router.get(['/image/:id'], (ctx, next) => {
  const chance = utils.getRandomInt(0,3);
  var index = isNaN(ctx.params.id)?chance:parseInt(ctx.params.id);
  index = index % 4;
  const fpath = path.join(__dirname, "../media/pic" + index + ".jpg");
  ctx.set('Content-Type', 'image/jpeg');
  ctx.body = fs.createReadStream(fpath);
});

// listen
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(SERVER_IP_PORT);

utils.writeLog(`Server started at http://${SERVER_IP_ADDRESS}:${SERVER_IP_PORT}`);