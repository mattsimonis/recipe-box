const memjs = require('memjs');

const client = process.env.CACHE_VIEWS === 'true' ?
    memjs.Client.create() : null;

module.exports = {
  cacheViews(app) {
    if (!client) {
      return;
    }

    app.use((req, res, next) => {
      const viewKey = 'view_cache_' + req.originalUrl || req.url;
      client.get(viewKey, (err, value) => {
        if (err == null && value != null) {
          res.send(value.toString('utf8'));
          return;
        }
        res.sendRes = res.send;
        res.send = (body) => {
          client.set(viewKey, body, { expires: 3600 }, (err, val) => {
            if (err) {
              console.log(`error setting cache for ${viewKey}`);
            } else {
              console.log(`cache set for ${viewKey}`);
            }
          });
          res.sendRes(body);
        };
        next();
      });
    });
  },

  flush() {
    if (!client) {
      return;
    }

    client.flush();
  }
}