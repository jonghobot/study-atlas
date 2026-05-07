# DESIGN.md — Study Atlas Design System

## Purpose

Study Atlas is a GitHub Pages learning hub for research topics. New pages should feel like part of the same dark, technical, calm study environment: dense enough for serious reading, but broken into cards, panels, timelines, tables, and quizzes so long research material stays navigable.

This file is for AI coding/design agents. When adding or editing UI, follow these rules before inventing new styles.

## Brand Personality

- **Identity:** research atlas, technical study notebook, expandable seminar hub.
- **Tone:** focused, modern, quietly premium, not flashy.
- **Reader feeling:** “I can study a difficult paper here without getting lost.”
- **Avoid:** corporate SaaS blandness, playful consumer colors, excessive animation, decorative clutter.

## Visual Direction

- Dark academic dashboard with soft neon accents.
- Use generous spacing and rounded panels.
- Prefer structured sections over long unbroken prose.
- Make dense technical material scannable with summaries, tags, tables, and timeline rows.

## Color Tokens

Use the existing CSS variables in `styles.css`.

```css
:root {
  --bg: #070a12;       /* page background */
  --panel: #101827;    /* primary card/panel */
  --panel2: #142034;   /* secondary surfaces/buttons */
  --ink: #eef4ff;      /* main text */
  --muted: #a9b7ce;    /* secondary text */
  --line: #273653;     /* borders/dividers */
  --a: #7ce7c7;        /* mint accent */
  --b: #8fb5ff;        /* blue accent */
  --c: #ffd479;        /* warning/highlight accent */
  --r: #ff9a9a;        /* risk/error accent */
}
```

### Color Usage

- Background: `--bg` with the existing radial/linear gradient.
- Text: `--ink` for primary, `--muted` for explanatory or secondary copy.
- Accent links and eyebrow labels: `--a`.
- Secondary accent/year labels: `--b`.
- Warning panels: left border using `--c`.
- Avoid adding unrelated colors unless a new semantic state truly needs it.

## Typography

- Font stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Body line height: `1.68` for long-form readability.
- Hero title: large, tight, confident.
- Use Korean naturally; English technical terms are fine when they are standard in the field.
- Prefer concise headings and explanatory paragraphs.

## Layout

### Page Shell

Every page should use:

```html
<header class="top">
  <div class="wrap nav">...</div>
</header>
<main class="wrap">...</main>
<footer>...</footer>
```

- `.wrap` max width: 1160px.
- Horizontal padding: 24px.
- Top nav is sticky with blurred dark background.
- Keep nav links consistent across pages.

### Hero

Use a hero for every major page:

```html
<section class="hero">
  <p class="eyebrow">Topic / Page Type</p>
  <h1>Clear page title</h1>
  <p class="lead">One paragraph explaining what the reader will learn.</p>
  <p><span class="ghost">tag</span>...</p>
</section>
```

Hero copy should explain the study value, not just restate the title.

## Components

### Panels

Use `.panel` for major full-width sections.

Good for:
- 30초 요약
- reading order
- reference lists
- warnings / caveats
- quiz sections
- long explanations

```html
<section class="panel">
  <h2>Section title</h2>
  <p>...</p>
</section>
```

### Cards

Use `.card` inside `.grid` for compact concepts or reference items.

```html
<section class="grid g2">
  <article class="card">
    <span class="tag">systems</span>
    <h3>Title</h3>
    <p class="muted">Short summary.</p>
  </article>
</section>
```

Use `g2` for medium cards, `g3` for short overview cards. On mobile they collapse to one column.

### Timeline / Paper Rows

Use `.paper` for chronological or paper-review rows.

```html
<div class="paper">
  <div class="year">2026<br><span class="tag">KV</span></div>
  <div>
    <h3><a href="...">Paper title</a></h3>
    <p>Summary...</p>
  </div>
</div>
```

This is preferred for paper timelines, topic lists, and detailed summaries.

### Tables

Use `.table` for comparisons.

- Keep columns meaningful and short.
- Use tables for axes/trade-offs, not for long prose.
- Long explanations should go in `.paper` or `.panel` sections.

### Tags

Use `.tag` for category chips. Keep text short:

- `MoE`
- `KV`
- `serving`
- `pipeline`
- `2026`
- `context`

### Ghost Chips

Use `.ghost` for hero keywords and quick topic labels. They should be descriptive but not overly numerous.

### Warning / Recommendation Blocks

Use `.panel.warn` for caveats, source reliability, or proposed next work.

```html
<section class="panel warn">
  <h2>주의점</h2>
  <ul>...</ul>
</section>
```

### Code Blocks

Use:

```html
<pre><code class="code">...</code></pre>
```

Code blocks should be minimal and educational.

### Figures

Use:

```html
<figure class="figure">
  <img src="..." alt="...">
  <figcaption class="caption">...</figcaption>
</figure>
```

Always provide meaningful `alt` text.

### Quiz

Use `.panel.quiz` for understanding checks. Answers should be hidden with existing `showAnswer()` behavior.

## Content Structure for Topic Pages

A topic should generally include:

1. `index.html` — overview, reading order, topic cards.
2. `concepts.html` — core concepts and vocabulary.
3. `map.html` or `reviews.html` — research landscape / references.
4. Individual review or summary pages when the topic grows.
5. `quiz.html` — understanding checks.
6. Optional `opportunities.html` — research/product ideas.

## Writing Rules

- Prefer Korean explanations with standard English technical terms where useful.
- Start sections with the practical question: “why does this matter?”
- For papers, use this order:
  1. 문제의식
  2. 핵심 아이디어
  3. 방법 / 병렬화 축 / architecture
  4. 실험 또는 주장
  5. 한계와 trade-off
  6. 지금 중요한 이유
- Avoid shallow one-line link dumps. If a reference is included, explain why it matters.
- For latest preprints, mark uncertainty clearly: “preprint 중심”, “일반화 검증 필요”, etc.

## Interaction and Navigation

- Every new HTML page should link back to relevant previous/next pages using `.next`.
- Root nav should remain consistent.
- Search is injected by `script.js`; do not manually duplicate search UI.
- When adding pages, update `search-index.json` with `python3 scripts/build-search-index.py`.

## Accessibility

- Maintain strong contrast: `--ink` on dark backgrounds, `--muted` only for secondary text.
- Links should remain visibly colored.
- Do not rely on color alone; pair tags/labels with text.
- Use semantic headings in order where practical.
- Images need alt text.
- Buttons should describe their action.

## Responsive Rules

- Use existing `.g2`, `.g3`, `.review`, `.paper` responsive behavior.
- Do not create fixed-width layouts beyond `.wrap`.
- On mobile, dense tables can overflow; keep table text concise.
- Prefer stacked `.paper` blocks for long summaries.

## Do Not

- Do not introduce a light theme unless explicitly requested.
- Do not use unrelated brand colors or gradients.
- Do not add heavy animation.
- Do not create new component classes if `.panel`, `.card`, `.paper`, `.review`, `.table`, `.tag`, `.ghost`, `.button`, `.code`, or `.figure` already solve the need.
- Do not paste raw markdown tables into HTML pages.
- Do not add external scripts for styling.

## Good Example Pattern

```html
<section class="panel">
  <h2>대표 자료와 연대</h2>
  <div class="paper">
    <div class="year">2024<br><span class="tag">serving</span></div>
    <div>
      <h3><a href="https://arxiv.org/abs/...">Paper title</a></h3>
      <p>문제의식과 핵심 아이디어를 먼저 설명합니다.</p>
      <p class="muted">왜 지금 중요한지와 한계를 짧게 덧붙입니다.</p>
    </div>
  </div>
</section>
```

## Project-Specific Notes

- Current topics: Pop2Piano, DeepSeek V4, LLM Parallelism.
- Current visual language is already defined in `styles.css`; extend carefully.
- This is a study archive, so clarity and continuity matter more than novelty.
- When in doubt, choose a readable `.panel` or `.paper` block over a fancy layout.
