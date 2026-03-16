#!/usr/bin/env bash
set -euo pipefail
 
TARGET_BRANCH="${TARGET_BRANCH:-}"
 
# Repositories (HTTPS only)
REPOS=(
  "https://github.com/Team3-EventManagement/notification-service.git"
  "https://github.com/Team3-EventManagement/user-service.git"
  "https://github.com/Team3-EventManagement/Payment.git"
  "https://github.com/Team3-EventManagement/Bookingservice.git"
  "https://github.com/Team3-EventManagement/Ticket-Generator.git"
  "https://github.com/Team3-EventManagement/EventService.git"
)
 
require_git() {
  if ! command -v git >/dev/null 2>&1; then
    echo "❌ git is not installed. Please install git and re-run."
    exit 1
  fi
}
 
normalize_repo_dir() {
  local url="$1"
  local name="$(basename "$url")"
  echo "${name%.git}"
}
 
clone_or_update_repo() {
  local url="$1"
  local dir="$2"
 
  if [[ -d "$dir/.git" ]]; then
    echo "➡️  Updating existing repo: $dir"
    (
      cd "$dir"
      git fetch --all --prune
      git pull --ff-only
    )
  else
    echo "⬇️  Cloning $url into $dir"
    git clone "$url" "$dir"
  fi
 
  if [[ -n "${TARGET_BRANCH}" ]]; then
    echo "🔀 Checking out branch: ${TARGET_BRANCH} in $dir"
    (
      cd "$dir"
      git switch "${TARGET_BRANCH}" || \
      git checkout -b "${TARGET_BRANCH}" || true
    )
  fi
}
 
# -------- Main --------
 
require_git
 
BASE_DIR="$(pwd)"
echo "📁 Using current directory: $BASE_DIR"
 
for url in "${REPOS[@]}"; do
  dir="$(normalize_repo_dir "$url")"
  clone_or_update_repo "$url" "$dir"
  echo "✔️  Done: $dir"
  echo "-------------------------------------------"
done
 
echo "✅ All repositories processed."
echo "📦 Location: $BASE_DIR"