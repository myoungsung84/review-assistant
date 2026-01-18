# Review Assistant

> 🚧 **현재 개발중입니다** (v0.1.0-dev)

Electron + Vite 기반의 **포터블 데스크톱 애플리케이션**입니다.  
데이터를 수집·가공하여 실시간으로 표시하고 생성할 수 있습니다.

---

## ✨ Features

- ⚡ **Electron 30 + Vite 5 + React 18** - 모던 데스크톱 스택
- 📦 **Portable ZIP 배포** - 설치 불필요, 압축해제 후 바로 실행
- 🔗 **내장 HTTP 서버** - 독립적인 API 서버 (포트 17355)
- 🎯 **실시간 데이터 스트리밍** - SSE 기반 이벤트 처리
- 🪟 **Windows 우선 지원** - GitHub Release 자동화
- 📝 **TypeScript** - 완전한 타입 안전성

---

## 🗺️ Planned Features (향후 추가 예정)

- 🎤 **Whisper 통합** - 음성 입력 지원
- 📊 **상품 요약 기능** - AI 기반 자동 요약
- ✍️ **리뷰 생성 기능** - 자동 리뷰 생성
- 📈 **분석 대시보드** - 데이터 시각화

---

| 계층 | 기술 |
|------|------|
| **Desktop** | Electron 30+ |
| **Bundler** | Vite 5 |
| **Frontend** | React 18 + Material UI |
| **Backend** | Node.js HTTP Server |
| **Language** | TypeScript |
| **Packager** | electron-builder |
| **Release** | GitHub CLI + Bash Script |

---

## 📁 Project Structure

```
review-assistant/
├─ electron/                      # Electron + 내장 HTTP 서버
│  ├─ main.ts                    # Electron 메인 프로세스
│  ├─ preload.ts                 # IPC 브릿지
│  ├─ ipc/                       # IPC 핸들러 (향후)
│  └─ server/                    # 내장 HTTP 서버
│     ├─ index.ts               # 서버 시작 & 관리
│     ├─ router.ts              # 라우팅 엔진
│     ├─ middlewares/           # 인증, CORS 등
│     ├─ features/              # API 기능 모듈
│     │  ├─ coupang/           # 데이터 처리 엔드포인트
│     │  ├─ events/            # SSE 스트리밍
│     │  └─ health/            # 헬스체크
│     ├─ transport/            # HTTP 요청/응답, 이벤트 허브
│     ├─ lib/                  # 에러 클래스 등
│     └─ types/                # TypeScript 타입
│
├─ src/                         # React UI (Vite)
│  ├─ main.tsx                 # React 엔트리
│  ├─ App.tsx
│  ├─ app/                     # 앱 설정
│  │  ├─ AppProviders.tsx     # Context 제공자
│  │  └─ providers/           # 테마, 서버정보 등
│  ├─ components/             # UI 컴포넌트
│  │  ├─ layout/             # 레이아웃 (Panel, SplitLayout 등)
│  │  └─ ui/                 # 기본 UI (Button, Text 등)
│  ├─ features/              # 기능별 UI 모듈
│  │  ├─ coupang/           # 데이터 수집 패널
│  │  ├─ youtube/           # 추가 데이터 소스
│  │  └─ result/            # 결과 표시/생성 패널
│  ├─ pages/                 # 페이지
│  └─ shared/                # 공유 훅, 유틸
│
├─ shared/                      # 전역 타입 & 유틸
│  ├─ types/
│  │  ├─ coupang.ts         # 데이터 모델 타입
│  │  ├─ global.d.ts        # 전역 타입
│  │  └─ events/            # 이벤트 타입 & 채널
│  └─ utils/                # 날짜, 숫자, 문자열 등 유틸
│
├─ public/                      # 정적 자산
├─ scripts/                     # 릴리즈 자동화
│  └─ draft-release.sh         # Draft Release 생성
│
├─ dist/                        # 렌더러 빌드 결과
├─ dist-electron/              # Electron 빌드 결과
├─ release/                     # 최종 배포 산출물
│  └─ {version}/              # ZIP 파일 등
│
├─ vite.config.ts             # Vite + Electron 플러그인 설정
├─ tsconfig.json              # TypeScript 설정
├─ electron-builder.json5     # 패키징 설정
├─ package.json               # 의존성 & 스크립트
└─ README.md
```

---

## 🚀 Getting Started

### 설치

```bash
# 의존성 설치
npm install

# 또는 pnpm
pnpm install
```

### 개발

```bash
# Vite Dev Server + Electron 실행
npm run dev
```

- Vite Dev Server: `http://localhost:5173`
- 내장 서버: `http://127.0.0.1:17355`

### 빌드

```bash
# Windows ZIP 빌드
npm run build:win

# 또는 모든 플랫폼
npm run build:pack
```

결과물: `release/{version}/ReviewAssistant-{version}-portable.exe` (또는 zip)

### Release

```bash
# Draft Release 생성 (GitHub)
npm run draft:release
```

---

## 📡 Architecture

### Electron Process Structure

```
Main Process (electron/main.ts)
├─ BrowserWindow 생성
├─ 내장 HTTP 서버 시작 (포트 17355)
├─ IPC 핸들러 등록
└─ 앱 수명주기 관리

Renderer Process (src/)
├─ React UI
├─ API 호출 (http://127.0.0.1:17355)
└─ SSE 이벤트 수신

Embedded HTTP Server (electron/server/)
├─ 라우팅
├─ 미들웨어 (CORS, 인증 등)
├─ REST API 엔드포인트
└─ SSE 이벤트 스트리밍
```

### API Endpoints

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/health` | 서버 헬스체크 |
| POST | `/sources/coupang/publish` | 수집된 데이터 게시 |
| GET | `/events/coupang` | 실시간 데이터 SSE 스트림 |

---

## 🔧 주요 설정

### tsconfig.json Alias

```json
{
  "paths": {
    "@/*": ["src/*"],
    "@e/*": ["electron/*"],
    "@s/*": ["shared/*"]
  }
}
```

### Vite Proxy

Dev 모드에서 `/events` 요청을 자동으로 내장 서버로 프록시합니다.

```typescript
proxy: {
  '/events': {
    target: 'http://127.0.0.1:17355',
    changeOrigin: true,
  }
}
```

---

## 📦 빌드 산출물

| 경로 | 설명 |
|------|------|
| `dist/` | React 빌드 결과 (HTML, JS, CSS) |
| `dist-electron/` | Electron 빌드 결과 (JS) |
| `release/{version}/` | electron-builder 최종 산출물 |

---

## 🛠 Scripts

```bash
npm run dev              # 개발 모드 (Vite + Electron)
npm run lint            # ESLint 검사
npm run format          # Prettier 포맷팅
npm run build:renderer  # React 빌드만
npm run build:electron  # Electron 빌드만
npm run build:pack      # 전체 빌드 & 패키징
npm run build:win       # Windows ZIP 빌드
npm run build:mac       # macOS 빌드
npm run draft:release   # GitHub Draft Release 생성
npm run preview         # Vite 프리뷰
```

---

## 📚 Related Files

- **CURRENT_STATE.md** - 현재 구조 및 상태 정보
- **electron-builder.json5** - 패키징 설정 (앱 ID, 디렉토리 등)
- **.vscode/extensions.json** - 권장 VS Code 확장
