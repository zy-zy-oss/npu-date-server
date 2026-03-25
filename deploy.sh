#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

# ---------- helpers ----------
info()  { printf '\033[1;34m[INFO]\033[0m  %s\n' "$*"; }
ok()    { printf '\033[1;32m[OK]\033[0m    %s\n' "$*"; }
fail()  { printf '\033[1;31m[FAIL]\033[0m  %s\n' "$*"; exit 1; }

# ---------- detect OS ----------
OS="$(uname -s)"
case "$OS" in
  Darwin) PM="brew"   ;;
  Linux)
    if command -v apt &>/dev/null; then PM="apt"
    elif command -v dnf &>/dev/null; then PM="dnf"
    elif command -v yum &>/dev/null; then PM="yum"
    else fail "Unsupported Linux distribution (no apt/dnf/yum found)"; fi
    ;;
  *) fail "Unsupported OS: $OS" ;;
esac
info "Detected OS: $OS, package manager: $PM"

# ---------- Node.js ----------
if ! command -v node &>/dev/null; then
  fail "Node.js not found. Install Node.js >= 18 first: https://nodejs.org"
fi

NODE_VER=$(node -v | sed 's/^v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 18 ]; then
  fail "Node.js >= 18 required (found v$NODE_VER)"
fi
ok "Node.js $(node -v)"

# ---------- Redis ----------
if ! command -v redis-server &>/dev/null; then
  info "Installing Redis..."
  case "$PM" in
    brew) brew install redis ;;
    apt)  sudo apt update && sudo apt install -y redis-server ;;
    dnf)  sudo dnf install -y redis ;;
    yum)  sudo yum install -y redis ;;
  esac
fi

# Start Redis if not running
if ! redis-cli ping &>/dev/null 2>&1; then
  info "Starting Redis..."
  case "$PM" in
    brew) brew services start redis ;;
    *)    sudo systemctl enable --now redis-server 2>/dev/null \
          || sudo systemctl enable --now redis 2>/dev/null \
          || redis-server --daemonize yes ;;
  esac
fi
redis-cli ping &>/dev/null || fail "Redis is not responding"
ok "Redis is running"

# ---------- npm install ----------
info "Installing Node.js dependencies..."
npm install --production
ok "Dependencies installed"

# ---------- .env ----------
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    info "Created .env from .env.example — edit it with your credentials before starting"
  else
    fail ".env file not found and no .env.example to copy from"
  fi
fi
ok ".env exists"

# ---------- data dir ----------
mkdir -p data
ok "Data directory ready"

# ---------- start ----------
info "Starting npu-date-server..."
npm start
