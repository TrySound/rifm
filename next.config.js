const path = require('path');

module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/rifm' : '',
  webpack: config => {
    config.resolve.alias['rifm'] = path.resolve('./src/index.js');
    return config;
  },
};
