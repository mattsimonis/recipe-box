const express = require('express');
const favicon = require('serve-favicon');
const sassMiddleware = require('node-sass-middleware');
const compression = require('compression');
const path = require('path');

module.exports = (() => {
  const app = express();

  app.set('port', process.env.PORT || 8080);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(favicon('public/images/favicon.png'));
  app.use(sassMiddleware({
    src: path.join(__dirname),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    outputStyle: 'compressed',
    maxAge: 86400,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(compression());
  app.use(express.static(path.join(__dirname, 'public')));

  app.locals.basedir = path.join(__dirname, 'public');

  return app;
})();
