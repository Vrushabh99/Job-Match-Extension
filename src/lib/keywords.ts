// Each entry: [label shown in the UI, ...aliases that count as a mention].
// Aliases are matched case-insensitively as whole terms. Add your own below.
type Skill = [label: string, ...aliases: string[]];

const SKILLS: Skill[] = [
  // Frontend
  ["JavaScript", "javascript", "ecmascript", "es6"],
  ["TypeScript", "typescript"],
  ["React", "react", "reactjs", "react.js"],
  ["Redux", "redux", "redux toolkit", "rtk"],
  ["Next.js", "next.js", "nextjs"],
  ["Vue", "vue", "vue.js", "vuejs"],
  ["Angular", "angular", "angularjs"],
  ["Svelte", "svelte"],
  ["HTML", "html", "html5"],
  ["CSS", "css", "css3"],
  ["Sass", "sass", "scss"],
  ["Tailwind", "tailwind", "tailwindcss", "tailwind css"],
  ["Material UI", "material ui", "material-ui", "mui"],
  ["Bootstrap", "bootstrap"],
  ["Webpack", "webpack"],
  ["Vite", "vite"],
  ["Babel", "babel"],
  ["Storybook", "storybook"],
  ["State management", "state management"],
  ["Responsive design", "responsive design", "responsive"],
  ["Accessibility", "accessibility", "wcag", "a11y", "aria"],
  ["Performance optimization", "performance optimization", "web performance", "core web vitals", "lazy loading"],
  ["i18n", "i18n", "internationalization", "localization"],
  ["Browser extensions", "chrome extension", "chrome extensions", "browser extension", "browser extensions", "manifest v3"],
  ["Design systems", "design system", "design systems", "component library", "component libraries"],
  ["Figma", "figma"],

  // Testing
  ["Jest", "jest"],
  ["React Testing Library", "react testing library", "rtl"],
  ["Cypress", "cypress"],
  ["Playwright", "playwright"],
  ["Vitest", "vitest"],
  ["Unit testing", "unit testing", "unit tests", "unit test"],
  ["End-to-end testing", "e2e", "end-to-end", "end to end"],
  ["TDD", "tdd", "test-driven", "test driven"],

  // Backend and data
  ["Node.js", "node.js", "nodejs", "node"],
  ["Express", "express", "express.js", "expressjs"],
  ["NestJS", "nestjs", "nest.js"],
  ["GraphQL", "graphql"],
  ["REST APIs", "rest", "restful", "rest api", "rest apis"],
  ["WebSockets", "websocket", "websockets", "socket.io"],
  ["MongoDB", "mongodb", "mongo", "mongoose"],
  ["PostgreSQL", "postgresql", "postgres"],
  ["MySQL", "mysql"],
  ["SQL", "sql"],
  ["Redis", "redis"],
  ["Python", "python"],
  ["Java", "java"],
  ["Go", "golang"],
  ["Microservices", "microservices", "microservice"],
  ["Serverless", "serverless"],
  ["JWT", "jwt", "json web token", "json web tokens"],
  ["OAuth", "oauth", "oauth2", "oauth 2.0"],

  // Cloud and tooling
  ["Docker", "docker"],
  ["Kubernetes", "kubernetes", "k8s"],
  ["AWS", "aws", "amazon web services", "s3", "ec2", "dynamodb"],
  ["Azure", "azure"],
  ["GCP", "gcp", "google cloud"],
  ["CI/CD", "ci/cd", "cicd", "github actions", "jenkins"],
  ["Git", "git", "github", "gitlab"],
  ["Linux", "linux"],

  // AI
  ["LLMs", "llm", "llms", "large language model", "large language models"],
  ["RAG", "rag", "retrieval augmented generation", "retrieval-augmented generation"],
  ["Generative AI", "generative ai", "gen ai", "genai"],
  ["Prompt engineering", "prompt engineering"],
  ["AI agents", "ai agent", "ai agents", "agentic"],
  ["Vector databases", "vector database", "vector databases", "embeddings", "pinecone"],
  ["LangChain", "langchain"],
  ["OpenAI", "openai"],

  // Ways of working
  ["Agile", "agile", "scrum", "kanban"],
  ["Code review", "code review", "code reviews"],
  ["Mentoring", "mentoring", "mentorship", "mentor"],
  ["Cross-functional", "cross-functional", "cross functional"],
  ["System design", "system design"],
  ["Jira", "jira"],
  ["Salesforce", "salesforce"],
];

export type KeywordHit = { label: string; count: number };
export type Comparison = { matched: KeywordHit[]; missing: KeywordHit[] };

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, " ");

// Whole-term match that also works for terms like node.js and ci/cd.
// Longest alias first so "node.js" counts once instead of also as "node".
function termRegex(aliases: string[], flags: string): RegExp {
  const pattern = [...aliases]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex)
    .join("|");
  return new RegExp(`(?<![a-z0-9+#.])(?:${pattern})(?![a-z0-9+#])`, flags);
}

// Sorted by how often the posting mentions each term.
export function compare(postingText: string, resumeText: string): Comparison {
  const posting = normalize(postingText);
  const resume = normalize(resumeText);
  const matched: KeywordHit[] = [];
  const missing: KeywordHit[] = [];

  for (const [label, ...aliases] of SKILLS) {
    const count = (posting.match(termRegex(aliases, "g")) ?? []).length;
    if (count === 0) continue;
    const onResume = termRegex(aliases, "").test(resume);
    (onResume ? matched : missing).push({ label, count });
  }

  const byCount = (a: KeywordHit, b: KeywordHit) =>
    b.count - a.count || a.label.localeCompare(b.label);
  return { matched: matched.sort(byCount), missing: missing.sort(byCount) };
}
