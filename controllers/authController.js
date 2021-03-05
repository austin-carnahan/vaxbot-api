const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const authenticate = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 20,
    jwksUri: `https://vaxbot.us.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://api.vaxbot.org',
  issuer: `https://vaxbot.us.auth0.com/`,
  algorithms: ['RS256']
});

module.exports = authenticate;
