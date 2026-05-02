# Study Atlas 작업 메모

이 저장소는 Jongho가 계속 분량 추가, 자료조사, 기능 추가를 할 GitHub Pages 학습 허브다. 매번 전체 파일을 다 읽어 컨텍스트를 낭비하지 않도록 아래 방식으로 작업한다.

## 빠른 위치

- 저장소: `/Users/jongho/.openclaw/workspace/study-pages-template`
- 원격: `https://github.com/jonghobot/study-atlas.git`
- 배포 브랜치: `main`
- 공통 스타일: `styles.css`
- 공통 JS/검색 기능: `script.js`
- 검색 인덱스: `search-index.json`
- DeepSeek V4 리뷰 목록: `topics/deepseek-v4/reviews.html`
- 개별 리뷰 페이지: `topics/<topic>/reviews/<paper>.html`
- 주제별 개요 페이지: `topics/<topic>/index.html`

## 기본 작업 흐름

1. `git status --short`로 작업트리 확인.
2. 요청 대상 페이지만 읽기. 예: 특정 논문 리뷰면 해당 `topics/<topic>/reviews/<paper>.html`부터 본다.
3. 새 자료조사는 필요한 논문/공식 문서만 짧게 fetch하고, 페이지에 반영할 내용만 남긴다.
4. 페이지 본문 수정 후 검색 인덱스 재생성:
   ```bash
   python3 scripts/build-search-index.py
   ```
5. 최소 검증:
   ```bash
   node --check script.js
   python3 -m json.tool search-index.json >/dev/null
   python3 - <<'PY'
   from pathlib import Path
   from html.parser import HTMLParser
   for p in Path('.').rglob('*.html'):
       HTMLParser().feed(p.read_text(encoding='utf-8'))
   print('html parse ok')
   PY
   ```
6. 변경 확인 후 커밋/푸시.

## 콘텐츠 페이지 확장 규칙

- 특정 페이지에만 임시로 덧붙이지 말고, 기존 구조를 유지하면서 section 단위로 추가한다.
- 너무 긴 문단보다 `panel`, `grid g2`, `table`, `review`, `paper` 같은 기존 CSS 컴포넌트를 활용해 읽기 좋게 쪼갠다.
- 논문/기술 리뷰 페이지에 추가할 만한 섹션 후보:
  - 30초 요약 / 한 줄 요약
  - 문제의식과 배경
  - 핵심 아이디어와 알고리즘 직관
  - 수식/figure/table 해설
  - 실험 결과와 metric 해석
  - 기존 방법과의 비교표
  - 실제 제품/serving/연구 적용 관점
  - 한계와 실패할 수 있는 조건
  - 세미나 질문/퀴즈
  - 참고문헌/링크 모음
- 상세 리뷰를 새로 만들거나 크게 보강할 때는 페이지 하단에 상세 리뷰용 `이해 확인 퀴즈`를 붙인다.
  - 기본 구성: 단답 주관식 4개 + 객관식 4개
  - 각 문항은 `showAnswer()` 버튼으로 정답을 펼치게 만든다.
  - 문제는 일반 상식이 아니라 해당 리뷰 본문을 읽었는지 확인하는 내용으로 만든다.
- 주제 개요 페이지에 추가할 만한 섹션 후보:
  - 읽는 순서
  - 핵심 개념 지도
  - 주요 논문/기술 타임라인
  - 연구 질문과 후속 아이디어
  - 실험/프로젝트 체크리스트
## 검색 기능 유지 규칙

- 검색 UI는 `script.js`가 모든 페이지 상단 nav에 자동 삽입한다.
- 검색 대상은 `search-index.json`이다.
- HTML 페이지를 추가/수정하면 반드시 `python3 scripts/build-search-index.py`를 실행해 인덱스를 갱신한다.
- 검색 결과 품질을 올리고 싶으면 각 페이지의 `<title>`, `<meta name="description">`, 본문 heading을 먼저 정리한다.

## 컨텍스트 절약 팁

- 매번 전체 저장소를 읽지 않는다. `find . -name '*.html'`로 목록만 보고 필요한 파일만 연다.
- 스타일/검색 기능 변경이 아니면 `styles.css`, `script.js`는 읽지 않는다.
- 자료조사는 원문 abstract, official repo, benchmark page처럼 신뢰도 높은 1~3개 소스만 우선 본다.
- 작업 결과는 이 파일이나 README에 짧게 갱신해 다음 세션이 이어받기 쉽게 한다.

## 커밋 메시지 관례

- 콘텐츠 보강: `Expand <paper/topic> review`
- 기능 추가: `Add <feature>`
- 검색 인덱스 갱신 포함: 본문 변경 커밋에 같이 포함
