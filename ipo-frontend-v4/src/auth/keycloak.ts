// Keycloak singleton — shared across the app.
// AuthProvider uses this same instance to initialize.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Keycloak = require("keycloak-js").default;

const keycloak = new Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_URL || "http://localhost:8080",
  realm: process.env.REACT_APP_KEYCLOAK_REALM || "ipo-realm",
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "ipo-frontend",
});

export default keycloak;
