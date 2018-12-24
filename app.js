const Prismic = require('prismic-javascript');
const PrismicDOM = require('prismic-dom');
const request = require('request');
const PrismicConfig = require('./prismic-configuration');
const app = require('./config');

const PORT = app.get('port');

app.listen(PORT, () => {
  process.stdout.write(`Point your browser to: http://localhost:${PORT}\n`);
});

// Middleware to inject prismic context.
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: PrismicConfig.apiEndpoint,
    linkResolver: PrismicConfig.linkResolver,
  };
  
  // Add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM;

  // Get the Homepage for access in all templates.
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
  ).then((response) => {
    const recipes = response.results;
    res.render('index', { recipes });
  });
});

app.route('/recipe/:uid').get((req, res) => {
  req.prismic.api.getByUID('recipe', req.params.uid).then((recipe) => {
    res.render('recipe', { recipe });
  });
});

app.route('/search').get((req, res) => {
  const { q } = req.query;
  if (!q) {
    const recipes = [];
    res.render('search', { recipes, q });
    return;
  }

  req.prismic.api.query(
    Prismic.Predicates.fulltext('my.recipe.name', q),
    { page: req.query.page || 1 },
  ).then((response) => {
    const recipes = response.results;
    res.render('search', { recipes, q });
  });
});

app.route('/tag/:tag').get((req, res) => {
  const { tag } = req.params;
  req.prismic.api.query(
    Prismic.Predicates.at('document.tags', [tag]),
  ).then((response) => {
    const recipes = response.results;
    res.render('tag', { recipes, tag });
  });
});
