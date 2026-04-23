
## 2026-04-23
- Installed PostgreSQL 18, created ipo_db
- Set up Keycloak realm ipo-realm, client ipo-frontend, test user
- Created Spring Boot backend with entities: OffreIPO, Intervenant, Tranche (abstract), TranchePersonnelCorporate, TranchePersonnelSyndicat
- Implemented REST endpoints: GET/POST /api/offres, POST /api/offres/{id}/tranches/corporate
- Built React frontend with Keycloak auth, offer list, offer creation, corporate tranche creation
- Tested full flow: login → create offer → add corporate tranche → data visible in pgAdmin
