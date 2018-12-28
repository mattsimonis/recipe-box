const memcached = require('memcached');

const server = process.env.MEMCACHE_SERVERS;
const client = server ? new memcached(server) : null;

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
          client.set(viewKey, body, 3600, (err) => {
            if (err) {
              process.stdout.write(`error setting cache for ${viewKey}\n`);
            } else {
              process.stdout.write(`cache set for ${viewKey}\n`);
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
  },

  getContent(key) {
    return new Promise((resolve, reject) => {
      if (!client) {
        resolve(null);
      }
  
      client.get(key, (err, value) => {
        if (err == null && value != null) {
          resolve(value);
        } else {
          resolve(null);
        }
      });
    });
  },

  setContent(key, document) {
    if (!client) {
      return;
    }

    client.set(key, document, 3600, (err) => {
      if (err) {
        process.stdout.write(`error setting cache for ${key}\n`);
      } else {
        process.stdout.write(`cache set for ${key}\n`);
      }
    });
  }
}