const Prismic = require('prismic-javascript');
const PrismicDOM = require('prismic-dom');
const request = require('request');
const PrismicConfig = require('./prismic-configuration');
const app = require('./config');

const PORT = app.get('port');

app.listen(PORT, () => {
  process.stdout.write(`Point your browser to: http://localhost:${PORT}\n`);
});

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: PrismicConfig.apiEndpoint,
    linkResolver: PrismicConfig.linkResolver,
  };
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM;
  Prismic.api(PrismicConfig.apiEndpoint, {
    accessToken: PrismicConfig.accessToken,
    req,
  }).then((api) => {
    req.prismic = { api };
    api.getSingle('homepage')
      .then((document) => {
        res.locals.homepage = document;
        next();
      });
  }).catch((error) => {
    next(error.message);
  });
});

app.route('/').get((req, res) => {
  req.prismic.api.query(
    Prismic.Predicates.at('document.type', 'recipe'),
    { orderings: '[document.first_publication_date desc]' },
  ).then((query) => {
    const recipes = query.results;
    res.render('index', { recipes });
  });
});

app.route('/recipe/:uid').get((req, res) => {
  req.prismic.api.getByUID('recipe', req.params.uid).then((document) => {
    res.render('recipe', { document });
  });
});

app.route('/search').get((req, res) => {
  if (!req.query.q) {
    const recipes = [];
    res.render('search', { recipes });
    return;
  }

  req.prismic.api.query(
    Prismic.Predicates.fulltext('my.recipe.name', req.query.q),
    { page: req.query.page || 1 },
  ).then((query) => {
    const recipes = query.results;
    res.render('search', { recipes });
  });
});
