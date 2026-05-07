# ðŸ“Š Fininfo-IPO â€” Project Progress Tracker

> **Platform:** CDGK DÃ©positaire â€” IPO Management System
> **Last updated:** 2026-05-05

---

## ðŸ–¥ï¸ Infrastructure & Credentials

| Service    | How it runs        | URL                       | Credentials                        |
|------------|--------------------|---------------------------|------------------------------------|
| PostgreSQL | Native (Windows)   | `localhost:5432`          | `postgres` / `admin123`            |
| Keycloak   | **Docker**         | `localhost:8080`          | Admin panel: `admin` / `admin`     |
| Backend    | Maven (`mvn run`)  | `localhost:8081`          | JWT-protected (Keycloak tokens)    |
| Frontend   | npm (`npm start`)  | `localhost:3000`          | Login: `testuser` / `test`         |

**Keycloak Config:**
- Realm: `ipo-realm`
- Client: `ipo-frontend`
- Test user: `testuser` / `test`

**Database:**
- Name: `ipo_db`
- User: `postgres` / `admin123`

---

## âœ… Completed Work

### Phase 1 â€” Infrastructure Setup
- [x] PostgreSQL 18 installed, `ipo_db` database created
- [x] Keycloak deployed via Docker on port 8080
- [x] Keycloak realm `ipo-realm` configured
- [x] Keycloak client `ipo-frontend` configured
- [x] Test user `testuser` created in realm

### Phase 2 â€” Spring Boot Backend (Skeleton)
- [x] Spring Boot 3.x project initialized (`ipo-backend`)
- [x] PostgreSQL datasource configured (`application.properties`)
- [x] Keycloak JWT resource server configured (validates Bearer tokens)
- [x] CORS configured for `http://localhost:3000`
- [x] `SecurityConfig.java` â€” all routes secured, `/api/health` public
- [x] `HealthController.java` â€” `GET /api/health` â†’ `{ status: UP }`
- [x] JPA Hibernate DDL auto-update enabled (tables created on first run)

### Phase 3 â€” React Frontend (UI Complete)
- [x] React 18 + TypeScript + MUI v5 project initialized (`ipo-frontend-v4`)
- [x] React Router v6 with full URL-driven routing
- [x] Keycloak JS auth integrated (`AuthContext.tsx`, `keycloak.ts`)
- [x] `AppLayout` with sidebar/header navigation
- [x] **MainMenuPage** â€” dashboard with module cards (Bourse, OTC, OPCVM, FRANCO, etc.) + dropdown submenu
- [x] **IpoListPage** â€” table of IPO offers with status badges, search, pagination
- [x] **IpoCreatePage** â€” full multi-tab form (Details, Participants, Tranche Corporate, Tranche Syndicale) â€” create / edit / view modes
- [x] **CollecteOrdreListPage** â€” table of subscription orders
- [x] **CollecteOrdreCreatePage** â€” subscription order form â€” create / edit / view modes
- [x] TypeScript types defined (`src/types/ipo.ts`) â€” full domain model
- [x] Mock data created (`src/mocks/apiData.ts`) â€” temporary placeholder

### Phase 4 â€” WAT Agent Framework
- [x] `agents.md` â€” 3-layer architecture rules in place
- [x] `directives/00_project_overview.md` â€” project map, domain objects, API target
- [x] `directives/01_build_backend_domain.md` â€” step-by-step backend build guide
- [x] `directives/02_wire_frontend_to_api.md` â€” frontend API wiring guide
- [x] `directives/03_run_and_test.md` â€” end-to-end test flow
- [x] `execution/check_backend_health.ps1` â€” health check script
- [x] `execution/check_db.ps1` â€” DB verification script
- [x] `execution/start_all.ps1` script created (currently needs encoding/parsing fix)
- [x] `execution/seed_db.sql` â€” dev seed data
- [x] `.env.example` â€” all credentials documented
- [x] `.gitignore` updated (`.env`, `.tmp/`, node_modules, build artifacts)

---

## ðŸ”´ Remaining Tasks

### ðŸ”¥ Priority 1 â€” Backend Domain Layer
> Directive: `directives/01_build_backend_domain.md`

- [x] Copy/confirm `application.properties` is in `web2/ipo-backend/src/main/resources/`
- [x] Create entity: `OffreIPO`
- [x] Create entity: `Intervenant` â† skipped for now
- [x] Create entity: `Tranche` â€” **NEW** `tranche_ipo` table, linked to `OffreIPO` via FK âœ…
- [x] Create entity: `OrdreCollecte`
- [x] Create repositories for all entities
- [x] Create `OffreIPOService` (CRUD)
- [x] Create `OrdreCollecteService` (CRUD)
- [x] Create `OffreIPOController` (`GET/POST /api/offres`, `GET/PUT/PATCH /api/offres/{id}`)
- [x] Create `OrdreCollecteController` (`GET/POST /api/ordres`, `GET/PUT/PATCH /api/ordres/{id}`)
- [x] Test: `mvn spring-boot:run` â†’ tables `offre_ipo` + `ordre_collecte` created in `ipo_db` âœ…
- [x] Test: `POST /api/offres` â†’ row created in DB, reference `CAM0000001` auto-generated âœ…

### ðŸ”¥ Priority 2 â€” Frontend API Wiring
> Directive: `directives/02_wire_frontend_to_api.md`

- [x] No axios needed â€” using native `fetch` with Keycloak token
- [x] Create `src/auth/keycloak.ts` â€” shared Keycloak singleton
- [x] Create `src/api/apiClient.ts` â€” fetch wrapper with JWT auto-refresh interceptor
- [x] Create `src/api/ipoApi.ts` â€” `fetchIpoList`, `fetchIpoById`, `createIpo`, `updateIpo`, `validateIpo`, **`fetchTranchesByIpo`** âœ…
- [x] Create `src/api/ordreApi.ts` â€” `fetchOrdreList`, `fetchOrdreById`, `createOrdre`, `updateOrdre`, `validateOrdre`
- [x] Update `IpoListPage` â€” loads from `GET /api/offres` with loading/error states
- [x] Update `IpoCreatePage` â€” saves to `POST /api/offres` or `PUT /api/offres/{id}` with spinner + toast
- [x] Update `CollecteOrdreListPage` â€” loads from `GET /api/ordres` with loading/error/empty states
- [x] Update `CollecteOrdreCreatePage` â€” saves to `POST /api/ordres` with spinner + toast âœ…
- [x] **Tranche flow wired** â€” Collecte form loads real IPO list + tranches from API âœ…
- [x] `ipoRows` mock removed from IpoListPage âœ…
- [x] Mock `tranches` removed from CollecteOrdreCreatePage âœ…
- [x] **Reference data wired** â€” Collecte form loads real Clients and Instruments from `GET /api/clients` and `GET /api/instruments` âœ…
- [x] ALL mock arrays (except societesBourse/types) deleted from `apiData.ts` âœ…

### ðŸŸ¡ Priority 3 â€” End-to-End Testing
> Directive: `directives/03_run_and_test.md`

- [ ] Full flow: Login â†’ Create IPO â†’ Add Tranche â†’ Submit â†’ Verify in pgAdmin
- [ ] Full flow: Navigate to Collecte â†’ Create order â†’ Link to IPO â†’ Verify in DB
- [ ] Error handling: Token expiry â†’ auto-refresh works
- [ ] Error handling: Backend down â†’ frontend shows graceful error

### ðŸŸ¢ Priority 4 â€” Polish & Production Prep
- [x] Add loading spinners to all list/form pages âœ…
- [x] Add toast notifications (success / error) on form submit âœ…
- [x] Checkbox selection works on both list pages âœ…
- [ ] Status display improvement (chips or colour) â€” tried + reverted, keeping plain text for now
- [ ] Add `mode="view"` read-only enforcement on all form fields
- [ ] Pagination on list pages (server-side)
- [ ] Filtering / search on IpoListPage and CollecteListPage (server-side)
- [ ] Docker Compose for full stack (backend + frontend + PostgreSQL + Keycloak)
- [x] Environment-based runtime config baseline (DB/Keycloak/CORS/frontend env vars)

---

## ðŸ“ Project Structure

```
Fininfo-IPO/
â”œâ”€â”€ agents.md                      â† WAT framework rules
â”œâ”€â”€ PROGRESS.md                    â† This file
â”œâ”€â”€ UPDATES.md                     â† Session-by-session change log
â”œâ”€â”€ TEST_CHECKLIST.md             â† Test suites for manual QA
â”œâ”€â”€ .env.example                   â† Credentials template
â”œâ”€â”€ .gitignore
â”œâ”€â”€ directives/                    â† SOPs (what to do)
â”‚   â”œâ”€â”€ 00_project_overview.md
â”‚   â”œâ”€â”€ 01_build_backend_domain.md
â”‚   â”œâ”€â”€ 02_wire_frontend_to_api.md
â”‚   â””â”€â”€ 03_run_and_test.md
â”œâ”€â”€ execution/                     â† Scripts (how to do it)
â”‚   â”œâ”€â”€ check_backend_health.ps1
â”‚   â”œâ”€â”€ check_db.ps1
â”‚   â”œâ”€â”€ start_all.ps1
â”‚   â””â”€â”€ seed_db.sql
â”œâ”€â”€ ipo-backend/                   â† Spring Boot (Java 17)
â”‚   â””â”€â”€ src/main/java/com/fininfo/ipobackend/
â”‚       â”œâ”€â”€ config/SecurityConfig.java
â”‚       â”œâ”€â”€ controller/
â”‚       â”‚   â”œâ”€â”€ HealthController.java
â”‚       â”‚   â”œâ”€â”€ OffreIPOController.java      â† GET/POST/PUT/PATCH /api/offres + /tranches
â”‚       â”‚   â””â”€â”€ OrdreCollecteController.java â† GET/POST/PUT/PATCH /api/ordres
â”‚       â”œâ”€â”€ dto/
â”‚       â”‚   â”œâ”€â”€ OffreIPOListDTO.java
â”‚       â”‚   â”œâ”€â”€ OffreIPODetailDTO.java
â”‚       â”‚   â”œâ”€â”€ OrdreCollecteListDTO.java
â”‚       â”‚   â”œâ”€â”€ OrdreCollecteDetailDTO.java
â”‚       â”‚   â””â”€â”€ TrancheDTO.java              â† NEW
â”‚       â”œâ”€â”€ entity/
â”‚       â”‚   â”œâ”€â”€ OffreIPO.java
â”‚       â”‚   â”œâ”€â”€ OrdreCollecte.java
â”‚       â”‚   â””â”€â”€ Tranche.java                 â† NEW (tranche_ipo table)
â”‚       â”œâ”€â”€ repository/
â”‚       â”‚   â”œâ”€â”€ OffreIPORepository.java
â”‚       â”‚   â”œâ”€â”€ OrdreCollecteRepository.java
â”‚       â”‚   â””â”€â”€ TrancheRepository.java       â† NEW
â”‚       â””â”€â”€ service/
â”‚           â”œâ”€â”€ OffreIPOService.java         â† Updated: auto-creates tranches on IPO save
â”‚           â””â”€â”€ OrdreCollecteService.java
â””â”€â”€ ipo-frontend-v4/               â† React 19 + TypeScript + MUI
    â””â”€â”€ src/
        â”œâ”€â”€ api/
        â”‚   â”œâ”€â”€ apiClient.ts              â† fetch wrapper + JWT auto-refresh
        â”‚   â”œâ”€â”€ ipoApi.ts                 â† fetchIpoList, fetchIpoById, createIpo, updateIpo, validateIpo, fetchTranchesByIpo
        â”‚   â””â”€â”€ ordreApi.ts               â† fetchOrdreList, fetchOrdreById, createOrdre, updateOrdre, validateOrdre
        â”œâ”€â”€ auth/
        â”‚   â”œâ”€â”€ keycloak.ts               â† shared Keycloak singleton
        â”‚   â””â”€â”€ AuthContext.tsx
        â”œâ”€â”€ components/
        â”œâ”€â”€ mocks/apiData.ts           â† clients, instruments, societesBourse (still needed)
        â”œâ”€â”€ pages/
        â”‚   â”œâ”€â”€ MainMenuPage.tsx
        â”‚   â”œâ”€â”€ IpoListPage.tsx
        â”‚   â”œâ”€â”€ IpoCreatePage.tsx
        â”‚   â”œâ”€â”€ CollecteOrdreListPage.tsx
        â”‚   â””â”€â”€ CollecteOrdreCreatePage.tsx
        â””â”€â”€ types/ipo.ts
```

---

## ðŸš€ Quick Start (Current Dev Setup)

```powershell
# 1. Start Keycloak (Docker)
docker start <your-keycloak-container>

# 2. Start Backend
cd ipo-backend
mvn spring-boot:run

# 3. Start Frontend
cd ipo-frontend-v4
npm start

# Or use the script:
.\execution\start_all.ps1
```

Login at `http://localhost:3000` â†’ `testuser` / `test`

---

## Progress Addendum - 2026-05-05 (Session 3)

### Completed in this session
- Backend references hardened: IPO (`CAM`) and order (`ORD`) references now use persisted DB ID generation instead of `count()+1`.
- Collecte edit/view stability fixed: tranche selection is now preserved after IPO/tranche reload.
- Environment-driven runtime config added:
  - Backend: datasource, issuer URI, and CORS are now env-based with defaults.
  - Frontend: Keycloak config now reads `REACT_APP_*` env vars with defaults.
  - Updated `.env.example` and `ipo-frontend-v4/.env` accordingly.
- Manual run validation completed:
  - Keycloak `http://localhost:8080` -> reachable
  - Backend `http://localhost:8081/api/health` -> reachable
  - Frontend `http://localhost:3000` -> reachable

### Current operational note
- `execution/start_all.ps1` currently has encoding/parsing issues and does not run reliably in its current state.
- Temporary workaround used: start backend/frontend directly via PowerShell process launch.

### Remaining follow-up
- Repair `execution/start_all.ps1` so startup is one-command again.
- Add full dev/prod profile split for backend/frontend configs.
- Run the manual checklist in `TEST_CHECKLIST.md` end to end on the now-running stack.




## Progress Addendum - 2026-05-07 (Backend API Hardening)

### Completed
- Standardized all backend API error responses through a single global contract.
- Added DTO-level input validation and cross-field validation for IPO and order payloads.
- Removed controller-local error handling that returned inconsistent/empty bodies.
- Enforced service-level domain rules for tranche/IPO coherence and allowed status transitions.
- Added dedicated controller/service tests for validation, not-found, domain violations, and internal error paths.

### Contract status
- Unchanged: routes, success status codes, and success payloads.
- Changed: error payload shape is now standardized with `code` and optional `fieldErrors`.

### Validation status
- Backend test suite executed with `mvn test`.
- Result: successful run, no failing tests.
