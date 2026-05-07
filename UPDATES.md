# ðŸ“‹ Session Updates Log

---

## ðŸ—“ï¸ Session 2 â€” 2026-05-05 (~11:00 â†’ 11:20 GMT+1)
**Goal:** Fix UI bugs, wire Collecte order form to real API, and implement IPO â†’ Tranche â†’ Collecte reference flow.

---

### ðŸ“¦ Update 7 â€” Fix Checkbox Bug (Both List Pages)
**Time:** ~11:05
**Status:** âœ… Done

#### What was done
The `<Checkbox>` components in both list pages had `checked` bound to state but no `onChange` handler â€” making them **read-only** (couldn't be clicked). Fixed with a toggle pattern.

#### Files updated
| File | Change |
|------|--------|
| `IpoListPage.tsx` | Added `onChange={() => setSelectedRowId((prev) => (prev === row.id ? null : row.id))}` |
| `CollecteOrdreListPage.tsx` | Same fix |

---

### ðŸ“¦ Update 8 â€” Wire CollecteOrdreCreatePage Save to Real API
**Time:** ~11:07
**Status:** âœ… Done

#### What was done
The "Sauvegarder" button in the Collecte order form was a `console.log` stub. Fully wired to `createOrdre` / `updateOrdre` with the same UX as IpoCreatePage.

#### Files updated
| File | Change |
|------|--------|
| `CollecteOrdreCreatePage.tsx` | Added `useParams`, `useEffect` (loads data in edit/view mode), async `handleSave` with API call, `CircularProgress` on button, `Snackbar`/`Alert` toast notifications |

#### New behaviour
- Create mode: `POST /api/ordres` â†’ toast "Ordre crÃ©Ã© avec succÃ¨s!" â†’ redirect to `/collecte`
- Edit mode: `PUT /api/ordres/{id}` â†’ toast "Ordre mis Ã  jour avec succÃ¨s!" â†’ redirect
- Error: Red toast with backend error message

---

### ðŸ“¦ Update 9 â€” Status Chips Added Then Reverted
**Time:** ~11:08 â†’ 11:10
**Status:** â†©ï¸ Reverted per user request

#### What was done
Added colour-coded `StatusChip` component (amber=PREVALIDE, green=VALIDE, red=ANNULE, blue=EN_ATTENTE) to both list pages. User preferred plain text â€” reverted to `BodyCell`.

#### Files changed and reverted
- `IpoListPage.tsx` â€” status column back to `<BodyCell text={row.status} />`
- `CollecteOrdreListPage.tsx` â€” same

---

### ðŸ“¦ Update 10 â€” IPO â†’ Tranche â†’ Collecte Reference Flow
**Time:** ~11:12 â†’ 11:20
**Status:** âœ… Done â€” Backend restarted, `tranche_ipo` table created in DB âœ…

#### What was done
Implemented the full tranche reference chain: when an IPO is saved, two tranches (Corporate + Syndicale) are auto-created in the DB. The Collecte order form now lets the user pick an IPO from a real dropdown, then pick a tranche, and the "RÃ©fÃ©rence IPO" field auto-fills.

#### New backend files
| File | Purpose |
|------|---------|
| `entity/Tranche.java` | JPA entity â€” `tranche_ipo` table, FK to `offre_ipo` |
| `repository/TrancheRepository.java` | `findByOffreIpoId()`, `existsByOffreIpoIdAndType()` |
| `dto/TrancheDTO.java` | `{id, label, type, referenceIpo, offreIpoId}` |

#### Updated backend files
| File | Change |
|------|--------|
| `service/OffreIPOService.java` | Injects `TrancheRepository`; `create()` auto-saves "Tranche Corporate" + "Tranche Syndicale" after IPO saved; new `findTranches(ipoId)` method (lazy-creates if missing) |
| `controller/OffreIPOController.java` | Added `GET /api/offres/{id}/tranches` endpoint |

#### Updated frontend files
| File | Change |
|------|--------|
| `api/ipoApi.ts` | Added `TrancheOption` interface + `fetchTranchesByIpo(ipoId)` function |
| `CollecteOrdreCreatePage.tsx` | Removed mock `tranches` import; added `ipoList` + `trancheList` state; `useEffect` loads IPO list on mount; second `useEffect` loads tranches when IPO selected; "DÃ©tails Tranche" section now has: IPO selector dropdown â†’ Tranche dropdown (disabled until IPO picked) â†’ read-only "RÃ©fÃ©rence IPO (auto)" |

#### New API endpoint
```
GET /api/offres/{id}/tranches
â†’ [{ id, label, type, referenceIpo, offreIpoId }, ...]
Example:
[
  { id: 1, label: "Tranche Corporate", type: "CORPORATE", referenceIpo: "CAM0000001", offreIpoId: 1 },
  { id: 2, label: "Tranche Syndicale", type: "SYNDICAL",  referenceIpo: "CAM0000001", offreIpoId: 1 }
]
```

#### Database result
```
public | tranche_ipo   â† âœ… new table created
```

---

### ðŸ“¦ Update 11 â€” Test Checklist Created
**Time:** ~11:10
**Status:** âœ… Done

#### Files created
| File | Description |
|------|-------------|
| `TEST_CHECKLIST.md` | 9 test suites, 50+ individual tests covering infrastructure, auth, IPO list/create/edit/validate, Collecte list/create, and end-to-end flow |

---

### ðŸ“¦ Update 12 â€” Collecte Form Edit/View Mode Fix
**Time:** ~11:35
**Status:** âœ… Done

#### What was done
When editing or viewing an order, the "RÃ©fÃ©rence IPO" dropdown was blank because the `OrdreCollecte` entity only returned `trancheId`.
Added `offreIpoId` to the DTO and resolved it via `TrancheRepository` in the service. The React form now correctly restores the selected IPO, which triggers the tranches to reload.

#### Files updated
- `OrdreCollecteDetailDTO.java` (added `offreIpoId`)
- `OrdreCollecteService.java` (resolved `offreIpoId` via `TrancheRepository`)
- `ordreApi.ts` (added `offreIpoId` to frontend model)
- `CollecteOrdreCreatePage.tsx` (restored `selectedIpoId` in `useEffect`)

---

### ðŸ“¦ Update 13 â€” Collecte Form Validation
**Time:** ~11:40
**Status:** âœ… Done

#### What was done
Added strict client-side form validation before allowing an order to be saved. If required fields are missing, the form blocks submission, highlights fields in red, and shows error messages.

#### Requirements enforced:
1. Donneur d'ordre (required)
2. QuantitÃ© (required, must be > 0)
3. MnÃ©monique / Instrument (required)
4. RÃ©fÃ©rence IPO (required)
5. Tranche (required)
6. SociÃ©tÃ© de Bourse (required)

#### Files updated
- `CollecteOrdreCreatePage.tsx` (added `validateForm`, `errors` state, and JSX error feedback)

---

### ðŸ“¦ Update 14 â€” Reference Data APIs (Clients & Instruments)
**Time:** ~14:15
**Status:** âœ… Done

#### What was done
Eliminated the final pieces of mock data. Created DB tables for `Client` and `Instrument`, built a seeder to populate them on startup, exposed them via an API, and wired the React form to load them dynamically.

#### Files created/updated
- **Backend**: `Client.java`, `Instrument.java`, `ClientRepository.java`, `InstrumentRepository.java`, `ReferenceDataController.java`, `DatabaseSeeder.java` (Startup data script).
- **Frontend API**: `referenceApi.ts` created with `fetchClients` and `fetchInstruments`.
- **Frontend UI**: `CollecteOrdreCreatePage.tsx` updated to remove mock imports and fetch real lists in `useEffect`.
- **Cleanup**: Deleted unused arrays (`clients`, `instruments`, `tranches`, `ipoRows`) from `apiData.ts`.

---

### ðŸ“¦ Update 15 â€” Database Cleanup
**Time:** ~14:24
**Status:** âœ… Done

#### What was done
Dropped old, unused tables from earlier database iterations to keep the `ipo_db` schema clean and aligned with the current Entity definitions.

#### Dropped Tables
- `intervenant`
- `offreipo`
- `offreipo_membres_syndicat`
- `tranche`
- `tranche_personnel_corporate`
- `tranche_personnel_syndicat`

#### Current Clean Schema (5 tables)
1. `client`
2. `instrument`
3. `offre_ipo`
4. `ordre_collecte`
5. `tranche_ipo`

---

## â³ Still Remaining (as of 2026-05-05)

### Priority 3 â€” End-to-End Testing
- [ ] Create NEW IPO â†’ verify 2 tranche rows appear in `tranche_ipo`
- [ ] Open Collecte form â†’ select IPO â†’ select tranche â†’ save â†’ verify `ordre_collecte` row
- [ ] Edit IPO â†’ verify pre-filled form
- [ ] Token expiry â†’ auto-refresh still works

### Priority 4 â€” Polish
- [ ] `mode="view"` full read-only (individual field enforcement)
- [ ] Server-side pagination
- [ ] Server-side search/filtering
- [ ] Docker Compose full stack

---

## ðŸ—“ï¸ Session 1 â€” 2026-05-04 (~15:00 â†’ ~17:20 GMT+1)

---

## ðŸ—‚ï¸ Session Overview

This session completed the full backend domain layer build and wired the React frontend to real API endpoints. The platform went from a mock-data prototype to a fully functional full-stack application.

---

## ðŸ“¦ Update 1 â€” WAT Framework Instantiation
**Time:** ~15:17
**Status:** âœ… Done

### What was done
Instantiated the WAT (Workflows, Agents, Tools) 3-layer agent framework for the project by reading `agents.md` and scaffolding the full project structure.

### Files created
| File | Description |
|------|-------------|
| `directives/00_project_overview.md` | Full project map: stack, domain objects, routes, endpoints, current state |
| `directives/01_build_backend_domain.md` | Step-by-step SOP for building entities, repos, services, controllers |
| `directives/02_wire_frontend_to_api.md` | SOP for replacing frontend mocks with API calls |
| `directives/03_run_and_test.md` | End-to-end test flow with startup instructions |
| `execution/check_backend_health.ps1` | PowerShell script â€” hits `/api/health` and reports status |
| `execution/check_db.ps1` | PowerShell script â€” queries `ipo_db` and shows recent rows |
| `execution/start_all.ps1` | PowerShell script â€” launches backend + frontend in new windows |
| `execution/seed_db.sql` | SQL seed data for development testing |
| `.env.example` | Environment variables template with all credentials |
| `.tmp/.gitkeep` | Intermediate files directory (gitignored) |

### Files updated
| File | Change |
|------|--------|
| `.gitignore` | Added `.env`, `.tmp/*`, `ipo-frontend-v4/node_modules/`, `credentials.json` |

---

## ðŸ“¦ Update 2 â€” Credentials & Progress Tracker
**Time:** ~15:25
**Status:** âœ… Done

### What was done
Documented the correct infrastructure credentials (Keycloak running in Docker, PostgreSQL native on Windows) and created the master progress tracker file.

### Credentials confirmed
| Service | Mode | URL | Credentials |
|---------|------|-----|-------------|
| PostgreSQL | Native (Windows) | `localhost:5432` | `postgres` / `admin123` |
| Keycloak | **Docker** | `localhost:8080` | Admin: `admin`/`admin`, App user: `testuser`/`test` |
| Backend | Maven | `localhost:8081` | JWT-protected |
| Frontend | npm | `localhost:3000` | Login: `testuser`/`test` |

### Files created
| File | Description |
|------|-------------|
| `PROGRESS.md` | Master project tracker with all phases, completed items, remaining tasks, file tree, and quick-start commands |

### Files updated
| File | Change |
|------|--------|
| `.env.example` | Fixed credentials: Keycloak admin `admin/admin`, app user `testuser/test` (was `testuser123`) |

---

## ðŸ“¦ Update 3 â€” Spring Boot Backend Domain Layer
**Time:** ~15:36 â†’ 15:44
**Status:** âœ… Done â€” **BUILD SUCCESS (15 files)**

### What was done
Built the complete backend domain layer from scratch: JPA entities, Spring Data repositories, service classes with CRUD logic, REST controllers with JWT security.

### Files created

#### Entities (`src/main/java/.../entity/`)
| File | Table | Key Fields |
|------|-------|-----------|
| `OffreIPO.java` | `offre_ipo` | `reference` (CAM0000001), `typeOffre`, `status`, `prixSouscription`, dates, `createdAt` |
| `OrdreCollecte.java` | `ordre_collecte` | `reference` (ORD0000001), `clientId`, `instrumentId`, `quantite`, `prix`, `referenceIpo`, `status` |

#### DTOs (`src/main/java/.../dto/`)
| File | Purpose |
|------|---------|
| `OffreIPOListDTO.java` | Lightweight list row (id, reference, prix, typeOffre, status, createdAt) |
| `OffreIPODetailDTO.java` | Full create/edit/view payload (all fields) |
| `OrdreCollecteListDTO.java` | Lightweight list row (id, reference, quantite, clientLabel, societeBourse, status) |
| `OrdreCollecteDetailDTO.java` | Full create/edit/view payload (all fields) |

#### Repositories (`src/main/java/.../repository/`)
| File | Extends |
|------|---------|
| `OffreIPORepository.java` | `JpaRepository<OffreIPO, Long>` â€” `findByReference`, `existsByReference` |
| `OrdreCollecteRepository.java` | `JpaRepository<OrdreCollecte, Long>` â€” `findByReferenceIpo` |

#### Services (`src/main/java/.../service/`)
| File | Methods |
|------|---------|
| `OffreIPOService.java` | `findAll()`, `findById()`, `create()`, `update()`, `validate()` â€” generates `CAM0000XXX` references |
| `OrdreCollecteService.java` | `findAll()`, `findById()`, `create()`, `update()`, `validate()` â€” generates `ORD0000XXX` references |

#### Controllers (`src/main/java/.../controller/`)
| File | Endpoints |
|------|-----------|
| `OffreIPOController.java` | `GET /api/offres`, `POST /api/offres`, `GET /api/offres/{id}`, `PUT /api/offres/{id}`, `PATCH /api/offres/{id}/validate` |
| `OrdreCollecteController.java` | `GET /api/ordres`, `POST /api/ordres`, `GET /api/ordres/{id}`, `PUT /api/ordres/{id}`, `PATCH /api/ordres/{id}/validate` |

### Compile result
```
[INFO] Compiling 15 source files with javac [release 17]
[INFO] BUILD SUCCESS
[INFO] Total time: 3.018 s
```

### Database tables auto-created by Hibernate on first run
```
offre_ipo        â† new
ordre_collecte   â† new
(+ existing tables from old backend: intervenant, tranche, etc.)
```

---

## ðŸ“¦ Update 4 â€” Frontend API Service Layer
**Time:** ~15:38 â†’ 15:42
**Status:** âœ… Done

### What was done
Created the frontend API layer using native `fetch` (no axios needed) with Keycloak JWT auto-refresh. Refactored `AuthProvider` to use a shared Keycloak singleton so the same token is used everywhere.

### Files created

| File | Description |
|------|-------------|
| `src/auth/keycloak.ts` | **New** â€” Keycloak singleton instance shared across auth + API |
| `src/api/apiClient.ts` | **New** â€” `apiGet`, `apiPost`, `apiPut`, `apiPatch` â€” all auto-attach JWT Bearer token, auto-refresh if expiring |
| `src/api/ipoApi.ts` | **New** â€” `fetchIpoList`, `fetchIpoById`, `createIpo`, `updateIpo`, `validateIpo` |
| `src/api/ordreApi.ts` | **New** â€” `fetchOrdreList`, `fetchOrdreById`, `createOrdre`, `updateOrdre`, `validateOrdre` |

### Files updated

| File | Change |
|------|--------|
| `src/auth/AuthProvider.tsx` | Removed local Keycloak construction â€” now imports shared singleton from `keycloak.ts` |

---

## ðŸ“¦ Update 5 â€” Wire List Pages to Real API
**Time:** ~15:39 â†’ 15:42
**Status:** âœ… Done

### What was done
Replaced all hardcoded mock data in the two list pages with real API calls. Added loading spinners, error states, and empty-state messages.

### Files updated

#### `src/pages/IpoListPage.tsx`
- **Removed:** `import { ipoRows as rows } from "../mocks/apiData"`
- **Added:** `import { fetchIpoList, validateIpo, type IpoRow } from "../api/ipoApi"`
- **Added:** `useEffect` â†’ calls `fetchIpoList()` on mount, sets `rows` state
- **Added:** Loading spinner (`CircularProgress`) while fetching
- **Added:** Error message if backend is unreachable
- **Changed:** `handleConfirmValidate` â†’ now calls `validateIpo(id)` then refreshes list
- **Fixed:** `row.prix` â†’ `row.prixSouscription` (field name from API)

#### `src/pages/CollecteOrdreListPage.tsx`
- **Full rewrite** â€” replaced all hardcoded single-row data with dynamic `rows.map()` loop
- **Added:** `import { fetchOrdreList, validateOrdre, type OrdreRow } from "../api/ordreApi"`
- **Added:** `useEffect` â†’ calls `fetchOrdreList()` on mount
- **Added:** Loading spinner and error state
- **Added:** Empty-state message: *"Aucun ordre trouvÃ©. CrÃ©ez votre premier ordre."*
- **Added:** Dynamic result count footer: *"N rÃ©sultats"*
- **Changed:** `handleOpenRowMenu` now takes `rowId` parameter (was hardcoded to `/collecte/edit/36`)

---

## ðŸ“¦ Update 6 â€” Wire IpoCreatePage Save Button to API
**Time:** ~15:55 â†’ 15:56
**Status:** âœ… Done â€” **Tested and working**

### What was done
The Save button in `IpoCreatePage` was just `console.log`. Wired it to `createIpo` / `updateIpo` with full UX feedback.

### Files updated

#### `src/pages/IpoCreatePage.tsx`
- **Added imports:** `useEffect`, `useParams`, `CircularProgress`, `Snackbar`, `Alert`, `createIpo`, `fetchIpoById`, `updateIpo`
- **Added state:** `saving` (boolean), `loadingData` (boolean), `snackbar` (open/message/severity)
- **Added:** `useEffect` â€” in edit/view mode, reads `:id` from URL, calls `fetchIpoById(id)`, maps DTO back to form state
- **Changed:** `handleSave` from `console.log` â†’ full async API call:
  - Maps form fields to `IpoDetail` DTO (handles commaâ†’dot decimal conversion)
  - Calls `createIpo()` or `updateIpo()` depending on mode
  - Shows loading spinner on Save button while in-flight
  - Shows success toast "IPO crÃ©Ã© avec succÃ¨s!" on success
  - Shows error toast with message on failure
  - Navigates back to `/ipo` list after 1.2s on success
- **Added:** Loading overlay when fetching existing IPO data
- **Added:** `<Snackbar>` + `<Alert>` at bottom of JSX for notifications

---

## ðŸ§ª Test Results

### Backend startup
```
[INFO] Found 2 JPA repository interfaces
[INFO] HikariPool-1 - Start completed
[INFO] Tomcat started on port 8081
[INFO] Started IpoBackendApplication in 3.765 seconds
```

### Health check
```json
GET http://localhost:8081/api/health
â†’ { "status": "UP", "service": "ipo-backend" }
```

### Database tables
```
public | offre_ipo        â† âœ… created
public | ordre_collecte   â† âœ… created
```

### End-to-end save test
```
1. Navigated to /ipo/create
2. Filled: Nature de Titre=Action, Prix=100, NbActions=1000, Montant=100000, ValeurNominale=10, RefAMMC=REF123
3. Clicked "Sauvegarder"
4. Button showed CircularProgress spinner âœ…
5. Green toast: "IPO crÃ©Ã© avec succÃ¨s!" âœ…
6. Redirected to /ipo list âœ…
7. New row appeared: ID=1, Reference=CAM0000001, Prix=100, Type=FIXED, Status=PREVALIDE âœ…
```

---

## â³ Still Remaining

### Priority 1 â€” CollecteOrdreCreatePage save button
The collecte order form (`/collecte/create`) still has `console.log` on save â€” needs same treatment as IpoCreatePage.

### Priority 2 â€” Polish
- Loading spinners already added to list pages âœ…
- Toast notifications added to IPO create âœ…
- Still needed: toasts on collecte create/edit

### Priority 3 â€” End-to-end collecte flow
- Create a collecte order linked to an existing IPO â†’ verify in DB

### Priority 4 â€” Production prep
- Docker Compose for full stack (backend + PostgreSQL + Keycloak + frontend)
- Environment-based config (dev/prod profiles)

---

## ðŸ”§ Technical Notes

### Maven path (not on system PATH)
```powershell
$mvn = "C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.2\plugins\maven\lib\maven3\bin\mvn.cmd"
& $mvn -f ipo-backend/pom.xml spring-boot:run
```

### Killing old backend before restart
```powershell
$proc = Get-NetTCPConnection -LocalPort 8081 | Select-Object -First 1
Stop-Process -Id $proc.OwningProcess -Force
```

### Keycloak JWT auto-refresh pattern (apiClient.ts)
```ts
await keycloak.updateToken(30);  // refresh if token expires in < 30s
config.headers.Authorization = `Bearer ${keycloak.token}`;
```

### Auto-reference generation (backend)
- IPO references: `CAM0000001`, `CAM0000002`, ... (generated from persisted DB ID, zero-padded to 7 digits)
- Ordre references: `ORD0000001`, `ORD0000002`, ... (generated from persisted DB ID, zero-padded to 7 digits)

### Status values
| Entity | Statuses |
|--------|---------|
| OffreIPO | `PREVALIDE` (default), `VALIDE`, `ANNULE` |
| OrdreCollecte | `EN_ATTENTE` (default), `VALIDE`, `REJETE` |

---

## Session 3 - 2026-05-05 (~14:30 -> ~15:20 GMT+1)
**Goal:** Harden backend reference generation, fix tranche restoration in Collecte edit/view, externalize runtime config, and bring up all services for manual testing.

---

### Update 16 - Reference Generation Hardening (Backend)
**Time:** ~14:35
**Status:** Done

#### What was done
Replaced `count()+1` reference generation with deterministic ID-based generation to avoid collisions under concurrent create operations.

#### Files updated
| File | Change |
|------|--------|
| `ipo-backend/src/main/java/com/fininfo/ipobackend/service/OffreIPOService.java` | `CAM` reference now generated from persisted DB ID (`CAM%07d`) |
| `ipo-backend/src/main/java/com/fininfo/ipobackend/service/OrdreCollecteService.java` | `ORD` reference now generated from persisted DB ID (`ORD%07d`) |

#### Impact
- Removes duplicate reference risk when multiple requests create IPO/orders simultaneously.

---

### Update 17 - Collecte Edit/View Tranche Restore Fix (Frontend)
**Time:** ~14:45
**Status:** Done

#### What was done
Fixed the edit/view behavior where tranche selection could be cleared after IPO restoration triggered tranche reload.

#### Files updated
| File | Change |
|------|--------|
| `ipo-frontend-v4/src/pages/CollecteOrdreCreatePage.tsx` | Added restore guard (`trancheIdToRestoreRef`) so saved tranche is reapplied after tranche list loads |

#### Impact
- Existing order edit/view now keeps the correct tranche selected.

---

### Update 18 - Environment-Based Runtime Config
**Time:** ~14:55
**Status:** Done

#### What was done
Externalized backend and frontend runtime auth/connection settings using env variables with safe defaults.

#### Files updated
| File | Change |
|------|--------|
| `ipo-backend/src/main/resources/application.properties` | DB URL/user/pass, Keycloak issuer URI, and CORS origins switched to env-based config with defaults |
| `ipo-frontend-v4/src/auth/keycloak.ts` | Keycloak URL/realm/clientId now read from `REACT_APP_*` env vars with defaults |
| `.env.example` | Added `DB_URL`, `KEYCLOAK_ISSUER_URI`, `APP_CORS_ALLOWED_ORIGINS` |
| `ipo-frontend-v4/.env` | Aligned local frontend env values with project runtime |

---

### Update 19 - Manual Runtime Bring-Up
**Time:** ~15:10 -> ~15:20
**Status:** Done

#### What was done
Brought up and validated required services for manual platform testing.

#### Runtime checks
- Keycloak reachable at `http://localhost:8080` (HTTP 200)
- Backend reachable at `http://localhost:8081/api/health` (HTTP 200)
- Frontend reachable at `http://localhost:3000`

#### Note
- `execution/start_all.ps1` currently fails due script encoding/parsing issues; services were launched directly via PowerShell process start as a temporary workaround.



## Session 4 - 2026-05-07 (Backend hardening sprint)
**Goal:** Standardize API error responses, enforce DTO validation, and add service-level domain integrity checks.

---

### Update 20 - Global Error Contract
**Status:** Done

#### What was done
- Introduced a single API error response contract with: `timestamp`, `status`, `error`, `code`, `message`, `path`, `fieldErrors`.
- Added global exception handling via `@RestControllerAdvice`.

#### Files added
- `ipo-backend/src/main/java/com/fininfo/ipobackend/error/ApiFieldError.java`
- `ipo-backend/src/main/java/com/fininfo/ipobackend/error/ApiErrorResponse.java`
- `ipo-backend/src/main/java/com/fininfo/ipobackend/error/DomainRuleViolationException.java`
- `ipo-backend/src/main/java/com/fininfo/ipobackend/error/ErrorCodes.java`
- `ipo-backend/src/main/java/com/fininfo/ipobackend/error/GlobalExceptionHandler.java`

#### Mapping
- Validation errors -> `400` + `VALIDATION_ERROR`
- Not found -> `404` + `RESOURCE_NOT_FOUND`
- Domain rule violations -> `422` + `DOMAIN_RULE_VIOLATION`
- Unexpected errors -> `500` + `INTERNAL_ERROR` (safe message)

---

### Update 21 - DTO Validation + Controller Integration
**Status:** Done

#### What was done
- Added Jakarta validation annotations on create/update DTOs.
- Added cross-field checks:
  - IPO subscription date ordering (`periodeDebutSouscription <= periodeFinSouscription`)
  - Order type/price consistency rule for trigger orders
- Applied `@Valid` to controller request bodies.
- Removed controller-level `try/catch` wrappers so all errors flow through the global handler.

#### Files updated
- `ipo-backend/src/main/java/com/fininfo/ipobackend/dto/OffreIPODetailDTO.java`
- `ipo-backend/src/main/java/com/fininfo/ipobackend/dto/OrdreCollecteDetailDTO.java`
- `ipo-backend/src/main/java/com/fininfo/ipobackend/controller/OffreIPOController.java`
- `ipo-backend/src/main/java/com/fininfo/ipobackend/controller/OrdreCollecteController.java`

---

### Update 22 - Domain Integrity in Services
**Status:** Done

#### What was done
- Enforced tranche/domain consistency on order create/update:
  - `trancheId` must exist
  - if `referenceIpo` is provided, it must match the tranche IPO reference
- Enforced explicit status transitions:
  - IPO: `PREVALIDE -> VALIDE` only
  - Order: `EN_ATTENTE -> VALIDE` only

#### Files updated
- `ipo-backend/src/main/java/com/fininfo/ipobackend/service/OffreIPOService.java`
- `ipo-backend/src/main/java/com/fininfo/ipobackend/service/OrdreCollecteService.java`

---

### Update 23 - Automated Verification
**Status:** Done

#### Tests added
- `ipo-backend/src/test/java/com/fininfo/ipobackend/controller/OffreIPOControllerErrorContractTest.java`
- `ipo-backend/src/test/java/com/fininfo/ipobackend/controller/OrdreCollecteControllerErrorContractTest.java`
- `ipo-backend/src/test/java/com/fininfo/ipobackend/service/OffreIPOServiceDomainRulesTest.java`
- `ipo-backend/src/test/java/com/fininfo/ipobackend/service/OrdreCollecteServiceDomainRulesTest.java`

#### Command and result
- Command: `mvn test`
- Result: `BUILD SUCCESS` (12 tests, 0 failures, 0 errors)
