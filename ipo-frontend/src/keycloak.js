import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'ipo-realm',
  clientId: 'ipo-frontend',
});

export default keycloak;