import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false, // X-Powered-By: Next.js 숨김
  agentRules: false, // next dev가 AGENTS.md에 영어 안내 블록을 자동으로 넣지 않게(팀 규칙은 저장소 루트 AGENTS.md)
  // 보안 헤더(환희): 다른 사이트가 iframe으로 감싸지 못하게(같은 출처 실험실 iframe은 됨), 형식 추측 금지, 주소 노출 줄이기.
  // 카메라·마이크·위치는 쓰지 않는다(체크인 키오스크는 모의 인증). script-src까지 막는 전체 CSP는 실제 도입 때 nonce로.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    // 저장소 루트까지 묶는다: 화면(frontend)이 서버 쪽 코드(../backend: API 처리·AI·규칙·데이터)를 불러오기 때문
    root: path.join(__dirname, ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
