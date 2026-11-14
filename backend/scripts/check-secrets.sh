#!/bin/sh
# backend/scripts/check-secrets.sh — push 전에 비밀값이 저장소·빌드 결과에 들어가지 않았는지 확인한다.
# 사용: npm run check:secrets  (문제가 있으면 실패 코드 1, 비밀값 자체는 출력하지 않는다)
# --untracked: 아직 git add 안 한 새 파일도 본다(.gitignore에 있는 .env.local 등은 제외)
# 저장소 루트에서 돈다(frontend/에서 npm run check:secrets로 불러도). 경로는 모두 루트 기준
cd "$(git rev-parse --show-toplevel)" || exit 1
fail=0

# 1) .env 파일이 git에 올라갔는지 (.env.example은 괜찮음)
if git ls-files | grep -E '(^|/)\.env' | grep -v '\.env\.example$' >/dev/null 2>&1; then
  echo "✗ .env 파일이 저장소에 있어요. git rm --cached 로 빼세요"
  fail=1
fi

# 2) 키 값이 직접 적힌 줄 (docs·README도 본다: 설정 메모에 붙여 넣는 사고가 가장 흔함)
if git grep --untracked -qIE '(API_KEY|SECRET|TOKEN)[A-Z_]*[[:space:]]*[=:][[:space:]]*["'"'"']?[A-Za-z0-9_-]{16,}' -- \
  ':!*.example' ':!backend/scripts/check-secrets.sh' 2>/dev/null; then
  echo "✗ 키 값처럼 보이는 줄이 있어요 (git grep --untracked -nIE 'API_KEY|SECRET|TOKEN' 으로 확인)"
  fail=1
fi

# 3) 흔한 키 형식과 코드에 박힌 Bearer 토큰
if git grep --untracked -qIE '(sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{35}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]{10,}|Bearer [A-Za-z0-9._-]{20,})' -- \
  ':!backend/scripts/check-secrets.sh' 2>/dev/null; then
  echo "✗ 키 형식(sk-, AIza, ghp_, Bearer 등)이 저장소 파일에 있어요"
  fail=1
fi

# 4) 브라우저로 나가는 이름(NEXT_PUBLIC_)에 키·비밀을 넣었는지 (코드와 .env 파일)
if git grep --untracked -qIE 'NEXT_PUBLIC_[A-Z0-9_]*(KEY|SECRET|TOKEN|PASSWORD)' -- ':!*.md' ':!backend/scripts/check-secrets.sh' 2>/dev/null ||
  grep -sqE '^[[:space:]]*(export[[:space:]]+)?NEXT_PUBLIC_[A-Z0-9_]*(KEY|SECRET|TOKEN|PASSWORD)' \
    frontend/.env frontend/.env.local frontend/.env.development frontend/.env.development.local frontend/.env.production frontend/.env.production.local; then
  echo "✗ NEXT_PUBLIC_ 이름에 KEY/SECRET/TOKEN이 있어요. 이 값은 브라우저 번들에 그대로 들어가요"
  fail=1
fi

# 5) backend/lib/llm.ts가 클라이언트 컴포넌트로 끌려가지 않게 막혀 있는지
if [ -f backend/lib/llm.ts ] && ! grep -qE "^import ['\"]server-only['\"]" backend/lib/llm.ts; then
  echo "✗ backend/lib/llm.ts 맨 위에 import \"server-only\"; 가 없어요"
  fail=1
fi

# 6) 실제 키 값이 저장소 파일(새 파일 포함)이나 빌드 결과(번들, 미리 렌더한 HTML·RSC)에 들어갔는지
#    값은 변수에만 두고 stdin으로 넘긴다(화면·명령줄에 나오지 않음). 따옴표·CRLF·export·주석을 벗긴다
if [ -f frontend/.env.local ]; then
  key=$(grep -E '^[[:space:]]*(export[[:space:]]+)?LLM_API_KEY[[:space:]]*=' frontend/.env.local | head -1 |
    cut -d= -f2- | sed 's/[[:space:]]#.*//' | tr -d "\r\"' ")
  if [ "${#key}" -ge 8 ]; then
    if printf '%s\n' "$key" | git grep --untracked -qIF -f - 2>/dev/null; then
      echo "✗ LLM_API_KEY 값이 저장소 파일(아직 add 안 한 새 파일 포함)에 들어 있어요"
      fail=1
    fi
    built=0
    for d in frontend/.next/static frontend/.next/server/app frontend/.next/dev/static; do
      [ -d "$d" ] || continue
      built=1
      if printf '%s\n' "$key" | grep -rqF -f /dev/stdin "$d" 2>/dev/null; then
        echo "✗ LLM_API_KEY 값이 빌드 결과($d)에 들어 있어요. 브라우저로 나가는 파일이에요"
        fail=1
      fi
    done
    [ "$built" -eq 1 ] || echo "… 빌드 결과(.next)가 없어 번들 검사는 건너뛰었어요. npm run build 뒤에 다시 돌리세요"
  fi
fi

# 7) 학생·교실용 공개 명단이 원본과 맞는지(원본을 바꾸고 다시 안 만들었으면 실패)
if [ -f backend/scripts/make-public-class.mjs ]; then
  node backend/scripts/make-public-class.mjs >/dev/null 2>&1
  if git ls-files --error-unmatch backend/data/class-2-3.public.json >/dev/null 2>&1 && ! git diff --quiet -- backend/data/class-2-3.public.json; then
    echo "✗ backend/data/class-2-3.public.json이 원본과 달라졌어요. 방금 다시 만들었으니 함께 커밋하세요"
    fail=1
  fi
fi

# 8) 학생·교실·키오스크 번들에 교사 전용 정보(가짜 실명·말해보기 원문·예외 사유)가 실렸는지
if [ -f backend/scripts/check-bundle.mjs ] && ! node backend/scripts/check-bundle.mjs; then
  fail=1
fi

if [ "$fail" -eq 0 ]; then
  echo "✓ 비밀값 점검 통과"
fi
exit "$fail"
