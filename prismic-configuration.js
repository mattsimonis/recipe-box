module.exports = {
  apiEndpoint: 'https://recipe-box.prismic.io/api/v2',

  linkResolver(doc) {
    if (doc.type === 'recipe') {
      return `/recipe/${doc.uid}`;
    }

    return '/';
  },
};
