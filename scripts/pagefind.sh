#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
REPO_ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"
PAGEFIND_VERSION="${PAGEFIND_VERSION:-1.5.2}"
PAGEFIND_PYTHON_TARGET="${PAGEFIND_PYTHON_TARGET:-${TMPDIR:-/tmp}/pagefind-python-${PAGEFIND_VERSION}}"

if [ "$#" -eq 0 ]; then
  set -- --site public
fi

find_pagefind_bin() {
  if [ -n "${PAGEFIND_BIN:-}" ] && [ -x "${PAGEFIND_BIN}" ]; then
    printf '%s\n' "${PAGEFIND_BIN}"
    return 0
  fi

  if command -v pagefind_extended >/dev/null 2>&1; then
    command -v pagefind_extended
    return 0
  fi

  if command -v pagefind >/dev/null 2>&1; then
    command -v pagefind
    return 0
  fi

  for candidate in \
    "${REPO_ROOT}/.tools/pagefind/pagefind_extended" \
    "${REPO_ROOT}/.tools/pagefind/pagefind" \
    "${PWD}/.tools/pagefind/pagefind_extended" \
    "${PWD}/.tools/pagefind/pagefind"
  do
    if [ -x "${candidate}" ]; then
      printf '%s\n' "${candidate}"
      return 0
    fi
  done

  return 1
}

run_pagefind_via_python() {
  if ! command -v python3 >/dev/null 2>&1; then
    return 1
  fi

  if ! python3 -m pip --version >/dev/null 2>&1; then
    return 1
  fi

  mkdir -p "${PAGEFIND_PYTHON_TARGET}"
  python3 -m pip install \
    --quiet \
    --disable-pip-version-check \
    --target "${PAGEFIND_PYTHON_TARGET}" \
    "pagefind[extended]==${PAGEFIND_VERSION}"

  PYTHONPATH="${PAGEFIND_PYTHON_TARGET}${PYTHONPATH:+:${PYTHONPATH}}" \
    exec python3 -m pagefind "$@"
}

if PAGEFIND_CMD="$(find_pagefind_bin)"; then
  exec "${PAGEFIND_CMD}" "$@"
fi

if [ "${CF_PAGES:-}" = "1" ]; then
  run_pagefind_via_python "$@"
fi

cat >&2 <<EOF
Pagefind 未找到。

可选方案：
1. 用 pipx 安装：pipx install pagefind
2. 下载官方独立二进制到：${REPO_ROOT}/.tools/pagefind/pagefind_extended
3. 通过环境变量指定：PAGEFIND_BIN=/abs/path/to/pagefind_extended

Cloudflare Pages:
- 检测到 CF_PAGES=1 时，脚本会自动用 Python 安装 pagefind[extended]==${PAGEFIND_VERSION}
- 可通过 PAGEFIND_VERSION 覆盖版本
EOF
exit 1
