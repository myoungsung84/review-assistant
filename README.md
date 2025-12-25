# Review Assistant

Electron + Vite 기반의 **포터블(설치 없이 실행) 데스크톱 애플리케이션**입니다.  
Windows 환경에서 간단하고 안전하게 실행할 수 있도록 **ZIP 배포**를 기본으로 합니다.

---

## ✨ Features

- ⚡ Electron + Vite + React 기반
- 📦 **Portable ZIP 배포**
  - 설치 불필요
  - 압축 해제 후 바로 실행
- 🪟 Windows 우선 지원
- 🚀 GitHub Draft Release 자동화
- 🔒 Windows Defender / 권한 문제 최소화 설계

---

## 🧱 Tech Stack

- Electron 30+
- Vite 5
- React 18
- TypeScript
- electron-builder
- GitHub CLI (gh)

---

## 📁 Project Structure

```text
.
├─ electron/
│  ├─ main.ts
│  └─ preload.ts
├─ src/                  # React renderer
├─ dist/                 # Build output (portable zip)
├─ scripts/
│  └─ draft-release.sh
├─ vite.config.ts
├─ tsconfig.node.json
└─ package.json
