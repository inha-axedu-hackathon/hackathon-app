# NOTICE — 함께 쓰는 외부 코드와 글꼴

이 저장소의 팀 코드 밖에서 가져와 쓰는 것들이에요. 각 라이선스 조건(저작권 표시 유지)을 지켜요.

| 이름 | 쓰는 곳 | 저작권 | 라이선스 | 받는 방식 |
|---|---|---|---|---|
| QR Code Generator for JavaScript v2.0.4 | `frontend/public/lab/index.html`(실험실 연결용 QR) | Copyright (c) 2009 Kazuhiko Arase | MIT | 파일 안에 포함(머리글 저작권 표시 그대로) |
| PeerJS 1.5.5 | `frontend/public/lab/index.html`(실험실 기기 연결) | PeerJS 프로젝트(github.com/peers/peerjs의 LICENSE 참조) | MIT | unpkg·jsDelivr CDN에서 불러옴(저장소에 넣지 않음) |
| Pretendard | 화면 글꼴 | github.com/orioncactus/pretendard의 LICENSE 참조 | SIL Open Font License 1.1 | jsDelivr CDN |
| Noto Serif KR, Black Han Sans | 화면 글꼴 | Google Fonts 각 글꼴 페이지의 라이선스 참조 | SIL Open Font License 1.1 | Google Fonts |
| Next.js, React, Tailwind CSS 등 npm 의존성 | 앱 전체 | 각 프로젝트 | 각 `node_modules/*/LICENSE`(대부분 MIT) | `package.json` |

- MIT 라이선스(QR Code Generator, PeerJS에 적용) 허가 문구: Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
- 실험실(`frontend/public/lab/`) 자체는 팀원 저작물이고, 사용 동의를 받아 고치지 않고 그대로 씀
- 해례본 원문은 공공 영역(1446). 교과서 지문·삽화는 쓰지 않음
- AI: 안뇽GPT(BAZE) API Gateway를 통해 Claude Haiku 5.5를 부름. 시연 데이터는 모두 가상
