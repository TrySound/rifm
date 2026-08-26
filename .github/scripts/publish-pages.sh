#!/usr/bin/env bash
set -euo pipefail

mode=${1:?Usage: publish-pages.sh <production|preview|delete> [source-directory] [pr-number]}
source_directory=${2:-}
pr_number=${3:-}
repository_root=$(git rev-parse --show-toplevel)
pages_directory=$(mktemp -d "${RUNNER_TEMP:-/tmp}/rifm-pages.XXXXXX")

cleanup() {
  git -C "$repository_root" worktree remove --force "$pages_directory" >/dev/null 2>&1 || true
  rm -rf "$pages_directory"
}
trap cleanup EXIT

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git -C "$repository_root" fetch origin gh-pages:refs/remotes/origin/gh-pages
  git -C "$repository_root" worktree add --detach "$pages_directory" origin/gh-pages
else
  git -C "$repository_root" worktree add --detach "$pages_directory" HEAD
  git -C "$pages_directory" checkout --orphan gh-pages
  git -C "$pages_directory" rm -rf .
fi

case "$mode" in
  production)
    test -d "$source_directory"
    # Replace production while preserving all pr-* preview directories.
    find "$pages_directory" -mindepth 1 -maxdepth 1 \
      ! -name .git ! -name .nojekyll ! -name 'pr-*' -exec rm -rf {} +
    cp -a "$source_directory"/. "$pages_directory"/
    commit_message="Deploy production site"
    ;;
  preview)
    test -d "$source_directory"
    test -n "$pr_number"
    rm -rf "$pages_directory/pr-$pr_number"
    mkdir -p "$pages_directory/pr-$pr_number"
    cp -a "$source_directory"/. "$pages_directory/pr-$pr_number/"
    commit_message="Deploy preview for PR #$pr_number"
    ;;
  delete)
    test -n "$pr_number"
    rm -rf "$pages_directory/pr-$pr_number"
    commit_message="Remove preview for PR #$pr_number"
    ;;
  *)
    echo "Unknown publishing mode: $mode" >&2
    exit 1
    ;;
esac

touch "$pages_directory/.nojekyll"
git -C "$pages_directory" add -A

if git -C "$pages_directory" diff --cached --quiet; then
  echo "Pages content is already up to date."
  exit 0
fi

git -C "$pages_directory" config user.name github-actions\[bot\]
git -C "$pages_directory" config user.email 41898282+github-actions\[bot\]@users.noreply.github.com
# This generated branch has no package.json, so repository hooks cannot run here.
git -C "$pages_directory" commit --no-verify -m "$commit_message"
git -C "$pages_directory" push origin HEAD:gh-pages
