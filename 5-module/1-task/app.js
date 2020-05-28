const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = {};
const getMessage = new Promise((resolve, reject) => {
});

router.get('/subscribe', async (ctx, next) => {
  const id = Math.random();
  subscribers[id] = ctx;
  try {
    await getMessage;
  } catch (e) {

  }
});

router.post('/publish', async (ctx, next) => {
  const msg = ctx.request.body.message;
  if (msg) {
    for (const [id, client] of Object.entries(subscribers)) {
      client.status = 200;
      client.res.on('close', (err)=>{
        delete subscribers[id];
      });
      client.res.end(msg);
    }

    ctx.status = 200;
    ctx.body = msg;
  }
});

app.use(router.routes());

module.exports = app;
