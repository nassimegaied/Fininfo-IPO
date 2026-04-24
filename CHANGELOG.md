# Changelog

## 2026-04-23
- Installed PostgreSQL 18, created ipo_db
- Set up Keycloak realm ipo-realm, client ipo-frontend, test user
- Created Spring Boot backend with entities: OffreIPO, Intervenant, Tranche (abstract), TranchePersonnelCorporate, TranchePersonnelSyndicat
- Implemented REST endpoints: GET/POST /api/offres, POST /api/offres/{id}/tranches/corporate
- Built React frontend with Keycloak auth, offer list, offer creation, corporate tranche creation
- Tested full flow: login → create offer → add corporate tranche → data visible in pgAdmin
## 2026-04-24
- Backend: Created `InvestisseurProfile` DTO and implemented compatible‑tranche identification logic in `TrancheService`
- Backend: Added endpoint `POST /api/offres/{offreId}/tranches/compatibles` to return eligible tranches based on investor profile
- Backend: Fixed circular JSON reference in `Tranche` entity with `@JsonIgnore` on `offreIPO` field
- Backend: Implemented syndicate tranche creation endpoint `POST /api/offres/{offreId}/tranches/syndicat`
- Frontend: Built **Check Eligibility** page with investor profile form and results table
- Frontend: Created **Create Syndicate Tranche** form for `TranchePersonnelSyndicat`
- Frontend: Added global CSS styling (`index.css`) for a clean, professional look (navigation, forms, tables, cards)
- Full flow tested: create corporate/syndicate tranches → check eligibility → view matching tranches