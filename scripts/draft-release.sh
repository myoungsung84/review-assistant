#!/usr/bin/env bash
set -eu

TAG="${1:-}"
NOTES="${2:-}"

echo "🚀 Draft Release (portable zip only)"
echo

# package.json version
PKG_VER="$(node -p "require('./package.json').version")"

DEFAULT_TAG="v${PKG_VER}-dev"
DEFAULT_NOTES="new version"

# ======================
# TAG 입력
# ======================
if [ -z "$TAG" ]; then
  printf "Tag [default: %s]: " "$DEFAULT_TAG"
  read -r TAG
fi
[ -z "$TAG" ] && TAG="$DEFAULT_TAG"

# ======================
# NOTES 입력
# ======================
if [ -z "$NOTES" ]; then
  printf "Release notes [default: %s]: " "$DEFAULT_NOTES"
  read -r NOTES
fi
[ -z "$NOTES" ] && NOTES="$DEFAULT_NOTES"

echo
echo "▶ Tag   : $TAG"
echo "▶ Notes : $NOTES"
echo

# ======================
# TAG 형식 검증
# ======================
case "$TAG" in
  v*.*.*-dev|v*.*.*-dev.*) : ;;
  *)
    echo "❌ Invalid dev tag."
    echo "   Allowed:"
    echo "   - vX.Y.Z-dev"
    echo "   - vX.Y.Z-dev.N"
    exit 1
    ;;
esac

# ======================
# TAG vs package.json version 검증
# ======================
TAG_VER="$(echo "$TAG" | sed -E 's/^v([0-9]+\.[0-9]+\.[0-9]+).*/\1/')"

if [ "$TAG_VER" != "$PKG_VER" ]; then
  echo "❌ Version mismatch:"
  echo "   tag version  : $TAG_VER"
  echo "   package.json : $PKG_VER"
  echo "👉 version 맞춘 뒤 다시 실행하세요."
  exit 1
fi

# ======================
# gh 체크
# ======================
if ! command -v gh >/dev/null 2>&1; then
  echo "❌ gh (GitHub CLI) not found."
  echo "👉 Install gh and run: gh auth login"
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  echo "❌ gh not authenticated."
  echo "👉 Run: gh auth login"
  exit 1
fi

# ======================
# CLEAN (빌드 산출물 정리)
# ======================
echo "▶ Cleaning build outputs"
rm -rf dist dist-electron release

# (선택) tsbuildinfo도 같이 지우고 싶으면 주석 해제
# rm -f *.tsbuildinfo tsconfig*.tsbuildinfo

# ======================
# 의존성 설치
# ======================
echo "▶ Installing deps (npm ci)"
npm ci

# ======================
# OS별 빌드 (포터블 기준)
# ======================
OS="$(uname -s)"

case "$OS" in
  Darwin)
    BUILD_SCRIPT="build:pack"
    ;;
  MINGW*|MSYS*|CYGWIN*)
    BUILD_SCRIPT="build:win"
    echo "⚠ Windows detected: portable zip only."
    ;;
  *)
    BUILD_SCRIPT="build:pack"
    echo "⚠ Unknown OS ($OS): trying build:pack"
    ;;
esac

echo "▶ Building: npm run $BUILD_SCRIPT"
npm run "$BUILD_SCRIPT"

# ======================
# 결과물 수집 (zip/7z만)
# ======================
OUT_DIR="dist"

if [ ! -d "$OUT_DIR" ]; then
  echo "❌ Output directory not found: $OUT_DIR"
  exit 1
fi

echo "▶ Collecting portable artifacts (.zip/.7z)"
FILES="$(find "$OUT_DIR" -type f -name "*.zip" -o -type f -name "*.7z" 2>/dev/null || true)"

if [ -z "$FILES" ]; then
  echo "❌ No portable artifacts found."
  exit 1
fi

# ======================
# GitHub Draft Release
# ======================
echo "▶ Preparing GitHub Draft Release: $TAG"

if gh release view "$TAG" >/dev/null 2>&1; then
  echo "✔ Draft release exists (updating assets)"
else
  gh release create "$TAG" \
    --draft \
    --title "$TAG" \
    --notes "$NOTES"
  echo "✔ Draft release created"
fi

echo "▶ Uploading artifacts"
echo "$FILES" | tr '\n' '\0' | xargs -0 gh release upload "$TAG" --clobber

echo
echo "✅ Dev draft complete"
echo "   Tag   : $TAG"
echo "   Notes : $NOTES"
echo "   Dir   : $OUT_DIR"
