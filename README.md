# Cartax Agents

카택스 AI 에이전트 관리 플랫폼

## 구조

```
cartax-agents/
├── agents/
│   └── email-agent/
│       ├── meta.json          # 에이전트 메타 정보 + 시스템 프롬프트
│       ├── planner.md
│       ├── generator.md
│       ├── evaluator.md
│       └── (스킬 파일들)
└── src/                       # 웹앱 소스
```

## 새 에이전트 추가

1. `agents/` 아래 폴더 생성 (예: `agents/marketing-agent/`)
2. `meta.json` 작성 (email-agent 참고)
3. md 파일 추가
4. GitHub에 푸시 → 웹앱 자동 반영

## 로컬 실행

```bash
cp .env.example .env
# .env에 GitHub 정보 입력

npm install
npm start
```

## GitHub Pages 배포

```bash
# package.json의 homepage를 본인 주소로 변경
# "homepage": "https://[깃헙아이디].github.io/cartax-agents"

npm run deploy
```
