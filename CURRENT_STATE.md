# Review Assistant – Current State Snapshot

## 0. One-liner
Chrome Extension(Collector)로 쿠팡 데이터를 수집하고, Electron 앱(내장 HTTP 서버 + React UI)에서 표시/가공/생성을 수행하는 Review Assistant.

---

## 1. Repo Top-level Layout
- `electron/` : Electron main/preload + 내장 HTTP 서버(소스)
- `src/` : Renderer(React/Vite) UI
- `dist/` : Renderer 빌드 결과 + electron-builder 산출물(zip, win-unpacked 등)
- `dist-electron/` : Electron(main/preload/server) 빌드 결과(JS)
- `scripts/` : 릴리즈 자동화 스크립트
- `electron-builder.json5` : 패키징 설정
- `vite.config.ts`, `tsconfig*.json` : 빌드/타입스크립트 설정

---

## 2. Build Outputs (중요: 소스/산출물 분리)
### Renderer output
- `dist/`
  - `dist/assets/*`
  - `dist/index.html`
  - `dist/win-unpacked/*` (패키징 산출물)

### Electron output
- `dist-electron/`
  - `dist-electron/main.js`
  - `dist-electron/preload.js`
  - `dist-electron/server/**` (서버 빌드 결과)

> 운영/디버깅할 때 “소스(electron/, src/) vs 산출물(dist/, dist-electron/)” 혼동 금지.

---

## 3. Electron Runtime Entry Points
- `electron/main.ts` : Electron main entry
- `electron/preload.ts` : preload entry
- `electron/server/index.ts` : 내장 서버 entry (main에서 띄움)

---

## 4. Embedded HTTP Server Structure (electron/server)
### Core
- `electron/server/router.ts` : 라우팅 엔진
- `electron/server/transport/*` : request/response helper, event hub 등 전송 계층
- `electron/server/lib/errors.ts` : ApiError 등 공통 에러 정의
- `electron/server/middlewares/*` : auth, cors 등 미들웨어
- `electron/server/types/*` : router/controller 타입

### Feature-based Modules
- `electron/server/features/index.ts` : feature 등록/aggregate
- `electron/server/features/features.types.ts` : feature 타입 정의

#### 현재 feature 목록
- `features/health/`
  - `health.controller.ts`
  - `health.service.ts`
  - `index.ts`
- `features/coupang/`
  - `coupang-source.controller.ts`
  - `coupang-source.service.ts`
  - `coupang-source.schema.ts`
  - `index.ts`
- `features/events/`
  - `index.ts` (SSE/이벤트 스트림 등)

---

## 5. Renderer (React/Vite) Structure (src)
- `src/main.tsx` : renderer entry
- `src/App.tsx` : app root
- `src/app/providers/theme.ts` : MUI theme (다크 테마)
- `src/types/ipc.d.ts` : IPC 타입 정의
- `src/index.css`, `src/vite-env.d.ts`

---

## 6. UX Direction (고정)
- 데스크톱(Windows) 중심
- 다크 테마 유지
- 패널형 UI (좌: 쿠팡, 우: 유튜브/큐/상태, 프롬프트, 결과물)

---

## 7. Notes / TODO (현재 기준)
- `electron/ipc/`는 실제 IPC 채널/핸들러 정의가 들어갈 자리 (정리 필요)
- `dist/`, `dist-electron/`는 gitignore 및 배포 정책에 따라 관리
- CORS/SSE 관련 이슈는 `electron/server/middlewares/cors.ts` + `features/events`에서 같이 본다
