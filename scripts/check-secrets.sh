#!/bin/sh
# scripts/check-secrets.sh — push 전에 비밀값이 저장소나 브라우저 번들에 들어가지 않았는지 확인한다.
# 사용: npm run check:secrets  (문제가 있으면 실패 코드 1, 비밀값 자체는 출력하지 않는다)
fail=0

# 1) .env 파일이 git에 올라갔는지 (.env.example은 괜찮음)
if git ls-files | grep -E '(^|/)\.env' | grep -v '\.env\.example$' >/dev/null 2>&1; then
  echo "✗ .env 파일이 저장소에 있어요. git rm --cached 로 빼세요"
  fail=1
fi

# 2) 키 값이 직접 적힌 줄 (예시 파일·문서·이 스크립트는 제외)
if git grep -nIE '(API_KEY|SECRET|TOKEN)[A-Z_]*[[:space:]]*[=:][[:space:]]*["'"'"']?[A-Za-z0-9_-]{16,}' -- \
  ':!*.example' ':!docs/**' ':!README.md' ':!scripts/check-secrets.sh' >/dev/null 2>&1; then
  echo "✗ 키 값처럼 보이는 줄이 있어요 (git grep -nIE 'API_KEY|SECRET|TOKEN' 으로 확인)"
  fail=1
fi

# 3) 흔한 키 형식
if git grep -nIE '(sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{35}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]{10,})' >/dev/null 2>&1; then
  echo "✗ 키 형식(sk-, AIza, ghp_ 등)이 저장소 파일에 있어요"
  fail=1
fi

# 4) 브라우저 번들에 실제 키가 들어갔는지 (빌드 결과가 있을 때만)
if [ -f .env.local ] && [ -d .next/static ]; then
  key=$(grep -E '^LLM_API_KEY=' .env.local | head -1 | cut -d= -f2-)
  if [ -n "$key" ] && grep -rqF "$key" .next/static 2>/dev/null; then
    echo "✗ LLM_API_KEY 값이 브라우저 번들(.next/static)에 들어 있어요"
    fail=1
  fi
fi

if [ "$fail" -eq 0 ]; then
  echo "✓ 비밀값 점검 통과"
fi
exit "$fail"
