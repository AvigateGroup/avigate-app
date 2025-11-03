const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  server: {
    enhanceMiddleware: middleware => {
      return (req, res, next) => {
        // Force the server to use LAN IP
        return middleware(req, res, next);
      };
    },
  },
};
